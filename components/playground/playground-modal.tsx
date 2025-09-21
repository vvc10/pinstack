"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { X, RotateCcw, Copy, Download } from "lucide-react"
import { Sandpack } from "@codesandbox/sandpack-react"
import type { Pin } from "../../types/pin"

interface PlaygroundModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pin: Pin | null
}

export function PlaygroundModal({ open, onOpenChange, pin }: PlaygroundModalProps) {
  const [code, setCode] = useState("")
  const [sandpackFiles, setSandpackFiles] = useState({})
  const [template, setTemplate] = useState("react")

  // Check if we should show preview for the given language
  const shouldShowPreview = () => {
    if (!pin) return false
    const lang = pin.lang.toLowerCase()
    return lang === "javascript" || 
           lang === "typescript" || 
           lang === "tsx" || 
           lang === "jsx" || 
           lang === "html" || 
           lang === "css" ||
           lang.includes("react") ||
           lang.includes("next")
  }

  // Initialize code when pin changes
  useEffect(() => {
    if (pin) {
      console.log("PlaygroundModal: Pin received", pin)
      setCode(pin.code)
      updateSandpackFiles(pin.code, pin.lang)
    } else {
      console.log("PlaygroundModal: No pin received")
    }
  }, [pin])

  // Update Sandpack files when code changes
  useEffect(() => {
    if (code && pin) {
      updateSandpackFiles(code, pin.lang)
    }
  }, [code, pin])

  const updateSandpackFiles = (code: string, language: string) => {
    const lang = language.toLowerCase()
    let files = {}
    let newTemplate = "react"

    if (lang === "html" || lang.includes("html")) {
      newTemplate = "static"
      files = {
        "index.html": {
          code: code,
          active: true,
          hidden: false
        }
      }
    } else if (lang === "css" || lang.includes("css")) {
      newTemplate = "static"
      files = {
        "index.html": {
          code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Preview</title>
  <style>${code}</style>
</head>
<body>
  <div class="preview-content">
    <h1>CSS Preview</h1>
    <p>This is how your CSS looks:</p>
    <div class="sample-element">Sample Element</div>
  </div>
</body>
</html>`,
          active: true,
          hidden: false
        }
      }
    } else if (lang === "javascript" || lang === "js") {
      newTemplate = "vanilla"
      files = {
        "index.html": {
          code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JavaScript Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="app"></div>
  <script>
    ${code}
  </script>
</body>
</html>`,
          active: true,
          hidden: false
        }
      }
    } else if (lang === "typescript" || lang === "ts") {
      newTemplate = "vanilla-ts"
      files = {
        "index.html": {
          code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TypeScript Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="app"></div>
  <script type="module">
    ${code}
  </script>
</body>
</html>`,
          active: true,
          hidden: false
        }
      }
    } else if (lang === "vue" || lang.includes("vue")) {
      newTemplate = "vue"
      files = {
        "src/App.vue": {
          code: code,
          active: true,
          hidden: false
        }
      }
    } else if (lang === "svelte" || lang.includes("svelte")) {
      newTemplate = "svelte"
      files = {
        "src/App.svelte": {
          code: code,
          active: true,
          hidden: false
        }
      }
    } else {
      // Default to React for JSX/TSX/React
      newTemplate = "react"
      const componentName = extractComponentName(code)
      
      files = {
        "App.js": {
          code: `import React from 'react';
import './styles.css';

${code}

export default function App() {
  return (
    <div className="App">
      <${componentName} />
    </div>
  );
}`,
          active: true,
          hidden: false
        },
        "styles.css": {
          code: `/* Add your custom styles here */
.App {
  font-family: system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}`,
          active: false,
          hidden: false
        },
        "public/index.html": {
          code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
          active: false,
          hidden: false
        }
      }
    }

    setSandpackFiles(files)
    setTemplate(newTemplate)
  }

  const handleReset = () => {
    if (pin) {
      setCode(pin.code)
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
      <DialogContent className="!max-w-[80vw] w-[80vw] h-[90vh] p-0 rounded-2xl [&>div]:rounded-2xl sm:!max-w-[80vw] md:!max-w-[75vw] lg:!max-w-[70vw] xl:!max-w-[65vw] overflow-hidden" showCloseButton={false}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border-b gap-3 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-semibold truncate">{pin.title}</h2>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded flex-shrink-0">
                {pin.lang}
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Copy</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main Content - Full Sandpack */}
          <div className="flex-1 overflow-hidden">
            {shouldShowPreview() ? (
              <div className="h-full">
                <CodePreview 
                  code={code} 
                    language={pin.lang}
                  />
                </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25 m-4">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🚧</div>
                        <p className="text-sm text-muted-foreground">
                          Live preview not available for {pin.lang}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                    Only JavaScript, TypeScript, React, and HTML are currently supported
                        </p>
                      </div>
                    </div>
                  )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// CodePreview component using Sandpack for reliable, real-time preview
function CodePreview({ code, language }: { code: string; language: string }) {
  const [sandpackFiles, setSandpackFiles] = useState({})
  const [template, setTemplate] = useState("react")

  useEffect(() => {
    if (!code) return

    const lang = language.toLowerCase()
    let files = {}
    let newTemplate = "react"

    if (lang === "html" || lang.includes("html")) {
      newTemplate = "static"
      files = {
        "index.html": {
          code: code,
          active: true,
          hidden: false
        }
      }
    } else if (lang === "css" || lang.includes("css")) {
      newTemplate = "static"
      files = {
        "index.html": {
          code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Preview</title>
  <style>${code}</style>
</head>
<body>
  <div class="preview-content">
    <h1>CSS Preview</h1>
    <p>This is how your CSS looks:</p>
    <div class="sample-element">Sample Element</div>
  </div>
</body>
</html>`,
          active: true,
          hidden: false
        }
      }
    } else if (lang === "javascript" || lang === "js") {
      newTemplate = "vanilla"
      files = {
        "index.html": {
          code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JavaScript Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="app"></div>
  <script>
    ${code}
  </script>
</body>
</html>`,
          active: true,
          hidden: false
        }
      }
    } else if (lang === "typescript" || lang === "ts") {
      newTemplate = "vanilla-ts"
      files = {
        "index.html": {
          code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TypeScript Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="app"></div>
  <script type="module">
    ${code}
  </script>
</body>
</html>`,
          active: true,
          hidden: false
        }
      }
    } else if (lang === "vue" || lang.includes("vue")) {
      newTemplate = "vue"
      files = {
        "src/App.vue": {
          code: code,
          active: true,
          hidden: false
        }
      }
    } else if (lang === "svelte" || lang.includes("svelte")) {
      newTemplate = "svelte"
      files = {
        "src/App.svelte": {
          code: code,
          active: true,
          hidden: false
        }
      }
    } else {
      // Default to React for JSX/TSX/React
      newTemplate = "react"
      const componentName = extractComponentName(code)
      
      files = {
        "App.js": {
          code: `import React from 'react';
import './styles.css';

${code}

export default function App() {
  return (
    <div className="App">
      <${componentName} />
    </div>
  );
}`,
          active: true,
          hidden: false
        },
        "styles.css": {
          code: `/* Add your custom styles here */
.App {
  font-family: system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}`,
          active: false,
          hidden: false
        },
        "public/index.html": {
          code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
          active: false,
          hidden: false
        }
      }
    }

    setSandpackFiles(files)
    setTemplate(newTemplate)
  }, [code, language])

  return (
    <div className="h-full">
      <Sandpack
        template={template as any}
        files={sandpackFiles}
        options={{
          showNavigator: false,
          showRefreshButton: true,
          showTabs: true,
          showLineNumbers: true,
          showInlineErrors: true,
          wrapContent: true,
          editorHeight: "100%",
          editorWidthPercentage: 50,
          autorun: true,
          recompileMode: "delayed",
          recompileDelay: 300,
          bundlerURL: "https://bundler.ecstatic-dhawan.1-100044162.workers.dev",
        }}
        theme="dark"
        customSetup={{
          dependencies: {
            "react": "^18.0.0",
            "react-dom": "^18.0.0",
            "react-scripts": "^5.0.0"
          }
        }}
      />
    </div>
  )
}

// Helper function to extract component name from code
function extractComponentName(code: string): string {
  const patterns = [
    /export\s+default\s+function\s+(\w+)/,
    /export\s+default\s+(\w+)/,
    /const\s+(\w+)\s*=/,
    /function\s+(\w+)/,
    /export\s+const\s+(\w+)/,
    /class\s+(\w+)/
  ]
  
  for (const pattern of patterns) {
    const match = code.match(pattern)
    if (match) return match[1]
  }
  
  return "App"
}

