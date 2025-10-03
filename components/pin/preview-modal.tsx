"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { Sandpack } from "@codesandbox/sandpack-react"

interface PreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pin: Pin | null
}

interface Pin {
  id: string
  title: string
  description?: string
  code: string
  lang: string
  image?: string
  author_id?: string
  created_at?: string
  updated_at?: string
  tags?: string[]
  votes?: number
  is_liked?: boolean
  is_saved?: boolean
  author?: {
    id: string
    username: string
    avatar_url: string
  }
}

export function PreviewModal({ open, onOpenChange, pin }: PreviewModalProps) {
  const [loading, setLoading] = useState(true)

  // Set dark mode as default if no theme is set
  useEffect(() => {
    if (open) {
      // Only add dark mode if no theme is already set
      if (
        !document.documentElement.classList.contains("dark") &&
        !document.documentElement.classList.contains("light")
      ) {
        document.documentElement.classList.add("dark")
      }
    }
  }, [open])

  const getSandpackFiles = () => {
    if (!pin) return {}

    const { code } = pin
    const lang = (pin.lang || "").toLowerCase().replace(/^\./, "")

    const explicitlyReactLang = ["jsx", "tsx", "react", "typescriptreact", "react-ts"].includes(lang)
    const strongHtmlDoc = /<!DOCTYPE/i.test(code) || /<(html|head|body)\b/i.test(code)
    const hasHtmlTags = /<(div|span|button|a|p|ul|ol|li|section|article|main|header|footer|style|script)\b/i.test(code)

    const looksReactish =
      explicitlyReactLang ||
      /from\s+['"]react['"]/.test(code) ||
      /React\./.test(code) ||
      /export\s+default/.test(code) ||
      (/\breturn\s*\(/.test(code) && /\b(function|const|let|var)\b/.test(code))

    if (strongHtmlDoc) {
      return { "/index.html": { code, active: true } }
    }

    if (hasHtmlTags && !looksReactish) {
      return {
        "/index.html": {
          code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview</title>
</head>
<body>
${code}
</body>
</html>`,
          active: true,
        },
      }
    }

    switch (lang) {
      case "html":
      case "htm":
        return { "/index.html": { code, active: true } }
      case "css":
        return {
          "/styles.css": { code, active: true },
          "/index.html": {
            code: '<!DOCTYPE html>\n<html>\n<head>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <div>Your CSS styles will be applied here</div>\n</body>\n</html>',
          },
        }
      case "javascript":
      case "js": {
        const processedCode = `document.addEventListener('DOMContentLoaded', function() {
  try {
    ${code}
  } catch (error) {
    console.error('Error executing code:', error);
    const app = document.getElementById('app');
    if (app) app.innerHTML = '<div style="color:red;padding:20px;border:1px solid red;border-radius:8px;margin:20px;">Error: ' + error.message + '</div>';
  }
});`
        return {
          "/index.js": { code: processedCode, active: true },
          "/index.html": {
            code: '<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Preview</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <div id="app"></div>\n  <script src="index.js"></script>\n</body>\n</html>',
          },
          "/styles.css": {
            code: `*{box-sizing:border-box}
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif}`,
            active: false,
          },
        }
      }
      case "typescript":
      case "ts": {
        const processedTsCode = `document.addEventListener('DOMContentLoaded', function() {
  try {
    ${code}
  } catch (error) {
    console.error('Error executing code:', error);
    const app = document.getElementById('app');
    if (app) app.innerHTML = '<div style="color:red;padding:20px;border:1px solid red;border-radius:8px;margin:20px;">Error: ' + error.message + '</div>';
  }
});`
        return {
          "/index.ts": { code: processedTsCode, active: true },
          "/index.html": {
            code: '<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Preview</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <div id="app"></div>\n  <script type="module" src="index.ts"></script>\n</body>\n</html>',
          },
          "/styles.css": {
            code: `*{box-sizing:border-box}
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif}`,
            active: false,
          },
        }
      }
      case "react":
      case "jsx": {
        const processedReactCode = code
          .split("\n")
          .map((l) => (l.includes("@/components/ui/") ? "" : l))
          .join("\n")
          .replace(/import\s*[^;]*@\/components[^;]*;?\s*/g, "")
        return {
          "/App.js": { code: processedReactCode, active: true },
        }
      }
      case "tsx":
      case "typescriptreact":
      case "react-ts": {
        const processedReactCode = code
          .split("\n")
          .map((l) => (l.includes("@/components/ui/") ? "" : l))
          .join("\n")
          .replace(/import\s*[^;]*@\/components[^;]*;?\s*/g, "")
        return {
          "/App.tsx": { code: processedReactCode, active: true },
        }
      }
      case "vue":
        return { "/App.vue": { code, active: true } }
      case "svelte":
        return { "/App.svelte": { code, active: true } }
      default: {
        if (looksReactish) {
          return { "/App.js": { code, active: true } }
        }
        return {
          "/index.html": {
            code: `<!DOCTYPE html>
<html><head><meta charset="UTF-8" /></head><body>
<pre style="padding:16px;white-space:pre-wrap;word-break:break-word;background:#0b0b0b;color:#eaeaea;border-radius:8px"><code>${code
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")}</code></pre>
</body></html>`,
            active: true,
          },
        }
      }
    }
  }

  const getTemplate = () => {
    if (!pin) return "static"
    const lang = (pin.lang || "").toLowerCase().replace(/^\./, "")

    const explicitlyReactLang = ["jsx", "tsx", "react", "typescriptreact", "react-ts"].includes(lang)
    const strongHtmlDoc = /<!DOCTYPE/i.test(pin.code) || /<(html|head|body)\b/i.test(pin.code)
    const hasHtmlTags = /<(div|span|button|a|p|ul|ol|li|section|article|main|header|footer|style|script)\b/i.test(
      pin.code,
    )
    const looksReactish =
      explicitlyReactLang ||
      /from\s+['"]react['"]/.test(pin.code) ||
      /React\./.test(pin.code) ||
      /export\s+default/.test(pin.code) ||
      (/\breturn\s*\(/.test(pin.code) && /\b(function|const|let|var)\b/.test(pin.code))

    if (strongHtmlDoc) return "static"
    if (hasHtmlTags && !looksReactish) return "static"
    if (lang === "tsx" || lang === "typescriptreact" || lang === "react-ts") return "react-ts"
    if (lang === "jsx" || lang === "react" || looksReactish) return "react"
    if (lang === "ts" || lang === "typescript") return "vanilla-ts"
    if (lang === "html" || lang === "htm" || lang === "css") return "static"
    switch (lang) {
      case "vue":
        return "vue"
      case "svelte":
        return "svelte"
      default:
        return looksReactish ? "react" : "static"
    }
  }

  const handleOpenInNewTab = () => {
    if (pin) {
      window.open(`/preview/${pin.id}`, "_blank")
    }
  }

  if (!pin) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[80vw] w-[80vw] h-[80vh] p-0 overflow-hidden rounded-2xl"
        style={{ width: "80vw", maxWidth: "80vw", height: "80vh", maxHeight: "80vh" }}
      >
        {/* Custom styles for Sandpack */}
        <style jsx global>{`
           /* Force dialog to be 80% width and height with strict overflow control */
           [data-radix-dialog-content] {
             width: 80vw !important;
             max-width: 80vw !important;
             height: 80vh !important;
             max-height: 80vh !important;
             min-height: 80vh !important;
             overflow: hidden !important;
           }
           /* Additional overrides for dialog content */
           .dialog-content {
             height: 80vh !important;
             max-height: 80vh !important;
             min-height: 80vh !important;
             overflow: hidden !important;
           }
          .sp-wrapper {
            height: calc(80vh - 60px) !important;
            max-height: calc(80vh - 60px) !important;
            overflow: hidden !important;
          }
          .sp-layout {
            height: 100% !important;
            max-height: 100% !important;
            overflow: hidden !important;
            display: flex !important;
          }
          .sp-editor {
            height: 100% !important;
            max-height: 100% !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            flex: 1 !important;
          }
          .sp-preview {
            height: 100% !important;
            max-height: 100% !important;
            overflow-y: auto !important;
            overflow-x: auto !important;
            flex: 1 !important;
          }
          .sp-preview-iframe {
            height: 100% !important;
            min-height: 100% !important;
            max-height: 100% !important;
          }
          /* Ensure proper scrolling for both sides */
          .sp-layout .sp-editor {
            overflow-y: auto !important;
            overflow-x: hidden !important;
            height: 100% !important;
            max-height: 100% !important;
          }
          .sp-layout .sp-preview {
            overflow-y: auto !important;
            overflow-x: auto !important;
            height: 100% !important;
            max-height: 100% !important;
          }
          /* Force scrollable containers */
          .sp-editor .cm-scroller {
            overflow-y: auto !important;
            overflow-x: hidden !important;
            max-height: 100% !important;
            height: 100% !important;
          }
          .sp-preview .sp-preview-container {
            overflow-y: auto !important;
            overflow-x: auto !important;
            max-height: 100% !important;
            height: 100% !important;
          }
          /* Code editor text wrapping */
          .sp-editor .cm-editor {
            overflow-x: hidden !important;
            height: 100% !important;
            max-height: 100% !important;
          }
          .sp-editor .cm-scroller {
            overflow-x: hidden !important;
            overflow-y: auto !important;
            height: 100% !important;
            max-height: 100% !important;
          }
          .sp-editor .cm-content {
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }
          .sp-editor .cm-line {
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }
        `}</style>

        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold flex-1 mr-4">{pin.title}</DialogTitle>
            <div className="flex items-center gap-2 mr-12">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInNewTab}
                className="flex items-center gap-2 px-2 py-2 rounded-xl cursor-pointer bg-transparent"
              >
                <ExternalLink className="h-4 w-4" />
                Open
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 h-full overflow-hidden">
          {!pin?.code || pin.code.trim() === "" ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-muted-foreground text-sm">code is not available will be updated soon</p>
            </div>
          ) : (
            <Sandpack
              template={getTemplate()}
              files={getSandpackFiles()}
              options={{
                showNavigator: false,
                showTabs: true,
                showLineNumbers: true,
                showInlineErrors: true,
                wrapContent: true,
                editorHeight: "100%",
                editorWidthPercentage: 40,
                externalResources: ["https://cdn.tailwindcss.com"],
                initMode: "lazy",
              }}
              customSetup={{
                dependencies: {
                  "lucide-react": "latest",
                  react: "^18.0.0",
                  "react-dom": "^18.0.0",
                },
              }}
              theme="dark"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
