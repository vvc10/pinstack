"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Play } from "lucide-react"
import { useState } from "react"
import type { Pin } from "../../types/pin"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark"
import MonacoClient from "@/components/playground/monaco-client"
import { JSRunner } from "@/components/playground/js-runner"
import { PlaygroundModal } from "@/components/playground/playground-modal"
import { IntegrationButtons } from "@/components/integrations/integration-buttons"
import { RelatedPins } from "@/components/pin/related-pins"

export function PinModal({
  open,
  onOpenChange,
  pin,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  pin: Pin | null
}) {
  const [tab, setTab] = useState("code")
  const [editable, setEditable] = useState(pin?.code ?? "")
  const [runnerCode, setRunnerCode] = useState<string>("")
  const [playgroundOpen, setPlaygroundOpen] = useState(false)

  if (!pin) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-2xl [&>div]:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-pretty">{pin.title}</DialogTitle>
        </DialogHeader>

        {/* Add integrations toolbar under the header; hidden if no repoUrl is available */}
        <div className="mt-1 mb-2 flex items-center justify-between">
          <IntegrationButtons repoUrl={(pin as any).repoUrl} title={pin.title} />
          <Button
            onClick={() => setPlaygroundOpen(true)}
            className="gap-2"
            size="sm"
          >
            <Play className="h-4 w-4" />
            Open Playground
          </Button>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="mt-2">
          <TabsList>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            {pin.videoUrl ? <TabsTrigger value="video">Video</TabsTrigger> : null}
            <TabsTrigger value="playground">Playground</TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="mt-3">
            <div className="rounded-md bg-muted/50 ring-1 ring-border overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b">
                <span className="text-xs text-muted-foreground">Language: {pin.lang}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await navigator.clipboard.writeText(pin.code)
                  }}
                >
                  <Copy className="mr-2 h-3.5 w-3.5" />
                  Copy
                </Button>
              </div>
              <SyntaxHighlighter
                language={pin.lang === "typescript" ? "tsx" : pin.lang}
                style={oneDark as any}
                customStyle={{
                  margin: 0,
                  background: "transparent",
                  padding: "1rem",
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                }}
              >
                {editable}
              </SyntaxHighlighter>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-3">
            {/* Placeholder preview; runnable playground comes in a later milestone */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pin.image || "/placeholder.svg"}
              alt={`Preview for ${pin.title}`}
              className="w-full rounded-md border"
              style={{ height: pin.height }}
            />
          </TabsContent>

          {pin.videoUrl ? (
            <TabsContent value="video" className="mt-3">
              <div className="w-full bg-black rounded-md overflow-hidden border">
                <video className="w-full h-auto" src={pin.videoUrl} controls preload="metadata" />
              </div>
            </TabsContent>
          ) : null}

          <TabsContent value="playground" className="mt-3">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Language: {pin.lang}. Runner supports JavaScript only for now.
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditable(pin.code)}
                    aria-label="Reset editor to original code"
                  >
                    Reset Editor
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setRunnerCode(editable)}
                    disabled={pin.lang.toLowerCase() !== "javascript"}
                    aria-label="Run code"
                  >
                    Run
                  </Button>
                </div>
              </div>

              <MonacoClient language={pin.lang} value={editable} onChange={setEditable} height={280} />

              <JSRunner code={runnerCode} onReset={() => setRunnerCode("")} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Pins section at the bottom of the modal */}
        <RelatedPins pin={pin} />
      </DialogContent>

      {/* Playground Modal */}
      <PlaygroundModal
        open={playgroundOpen}
        onOpenChange={setPlaygroundOpen}
        pin={pin}
      />
    </Dialog>
  )
}
