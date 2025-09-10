"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"

// Lazy-load the Monaco editor only on the client
const Editor = dynamic(() => import("@monaco-editor/react").then((m) => m.Editor), {
  ssr: false,
  loading: () => null,
})

type MonacoClientProps = {
  language?: string
  value: string
  onChange: (val: string) => void
  height?: number | string
}

export default function MonacoClient({ language = "javascript", value, onChange, height = 320 }: MonacoClientProps) {
  // Map pin languages to Monaco languages
  const monacoLang = useMemo(() => {
    const l = (language || "javascript").toLowerCase()
    if (l.includes("ts")) return "typescript"
    if (l.includes("js")) return "javascript"
    if (l.includes("py")) return "python"
    if (l.includes("json")) return "json"
    if (l.includes("css")) return "css"
    if (l.includes("html")) return "html"
    return "plaintext"
  }, [language])

  return (
    <div className="rounded-md border bg-card">
      <Editor
        height={height}
        defaultLanguage={monacoLang}
        language={monacoLang}
        value={value}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          smoothScrolling: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: "on",
          tabSize: 2,
          renderWhitespace: "selection",
        }}
        onChange={(v) => onChange(v ?? "")}
      />
    </div>
  )
}
