"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { X, Play, RotateCcw, Copy, Download } from "lucide-react"
import MonacoClient from "./monaco-client"
import { JSRunner } from "./js-runner"
import type { Pin } from "../../types/pin"

interface PlaygroundModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pin: Pin | null
}

export function PlaygroundModal({ open, onOpenChange, pin }: PlaygroundModalProps) {
  const [code, setCode] = useState("")
  const [runnerCode, setRunnerCode] = useState("")
  const [activeTab, setActiveTab] = useState("editor")

  // Initialize code when pin changes
  useEffect(() => {
    if (pin) {
      setCode(pin.code)
      setRunnerCode("")
    }
  }, [pin])

  const handleRun = () => {
    setRunnerCode(code)
  }

  const handleReset = () => {
    if (pin) {
      setCode(pin.code)
      setRunnerCode("")
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  const handleDownload = () => {
    if (!pin) return
    
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${pin.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.${pin.lang}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!pin) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 rounded-2xl [&>div]:rounded-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold truncate">{pin.title}</h2>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {pin.lang}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                size="sm"
                onClick={handleRun}
                disabled={pin.lang.toLowerCase() !== "javascript"}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Run
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - Code Editor */}
            <div className="flex-1 border-r">
              <div className="h-full flex flex-col">
                <div className="p-3 border-b bg-muted/30">
                  <h3 className="text-sm font-medium">Code Editor</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Edit your code here. Changes will be reflected in the preview when you run.
                  </p>
                </div>
                <div className="flex-1 p-4">
                  <MonacoClient
                    language={pin.lang}
                    value={code}
                    onChange={setCode}
                    height="100%"
                  />
                </div>
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="flex-1">
              <div className="h-full flex flex-col">
                <div className="p-3 border-b bg-muted/30">
                  <h3 className="text-sm font-medium">Live Preview</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pin.lang.toLowerCase() === "javascript" 
                      ? "JavaScript output will appear here when you click Run."
                      : "Preview not available for this language. Only JavaScript is supported for live execution."
                    }
                  </p>
                </div>
                <div className="flex-1 p-4">
                  {pin.lang.toLowerCase() === "javascript" ? (
                    <JSRunner 
                      code={runnerCode} 
                      onReset={() => setRunnerCode("")} 
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🚧</div>
                        <p className="text-sm text-muted-foreground">
                          Live preview not available for {pin.lang}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Only JavaScript is currently supported for live execution
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

