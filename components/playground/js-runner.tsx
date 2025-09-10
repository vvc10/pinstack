"use client"

import { useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"

type JSRunnerProps = {
  code: string
  onReset?: () => void
}

export function JSRunner({ code, onReset }: JSRunnerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const srcDoc = useMemo(() => {
    // Basic HTML harness that captures console.log and errors to the page
    const escaped = code
    return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <style>
      body { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; background: #0b0b0c; color: #e6e6e6; margin: 0; padding: 12px; }
      pre { white-space: pre-wrap; word-break: break-word; }
      .log { color: #a6e22e; }
      .err { color: #ff5c57; }
    </style>
  </head>
  <body>
    <pre id="out"></pre>
    <script>
      const out = document.getElementById('out');
      function writeLine(text, cls) {
        const div = document.createElement('div');
        div.className = cls;
        div.textContent = String(text);
        out.appendChild(div);
      }
      const originalLog = console.log;
      console.log = (...args) => {
        originalLog(...args);
        writeLine(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '), 'log');
      };
      window.addEventListener('error', (e) => {
        writeLine(e.message, 'err');
      });
      try {
        ${escaped}
      } catch (e) {
        writeLine(e.message || e, 'err');
      }
    </script>
  </body>
</html>`.trim()
  }, [code])

  useEffect(() => {
    // Nothing else; iframe re-renders with new srcDoc when code changes
  }, [code])

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-md border overflow-hidden">
        <iframe
          ref={iframeRef}
          title="JS Runner"
          sandbox="allow-scripts"
          className="w-full h-64 bg-black"
          srcDoc={srcDoc}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onReset} aria-label="Reset output">
          Reset
        </Button>
        <span className="text-sm text-muted-foreground">
          JS runs in a sandboxed iframe. Avoid external network calls. Python run to be added with backend.
        </span>
      </div>
    </div>
  )
}
