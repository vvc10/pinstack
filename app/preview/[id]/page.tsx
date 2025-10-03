"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, Copy, Check } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Sandpack } from "@codesandbox/sandpack-react"

interface Pin {
  id: string
  title: string
  description: string
  code: string
  lang: string
  image: string
  author_id: string
  created_at: string
  updated_at: string
  tags: string[]
  votes: number
  is_liked: boolean
  is_saved: boolean
  author: {
    id: string
    username: string
    avatar_url: string
  }
}

export default function PreviewPage() {
  const params = useParams()
  const pinId = params.id as string
  const [pin, setPin] = useState<Pin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Set dark mode as default if no theme is set
  useEffect(() => {
    // Only add dark mode if no theme is already set
    if (!document.documentElement.classList.contains("dark") && !document.documentElement.classList.contains("light")) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  useEffect(() => {
    const fetchPin = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/pins/${pinId}`)
        if (!response.ok) {
          throw new Error("Pin not found")
        }
        const data = await response.json()
        // Transform the API response to match our Pin interface
        const transformedPin = {
          id: data.pin.id,
          title: data.pin.title,
          description: data.pin.description,
          code: data.pin.code,
          lang: data.pin.lang,
          image: data.pin.image,
          author_id: data.pin.author_id,
          created_at: data.pin.created_at,
          updated_at: data.pin.updated_at,
          tags: data.pin.tags || [],
          votes: data.pin.votes || 0,
          is_liked: false,
          is_saved: false,
          author: data.author,
        }
        console.log("Pin loaded:", transformedPin)
        console.log("Code:", transformedPin.code)
        console.log("Language:", transformedPin.lang)
        setPin(transformedPin)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load pin")
      } finally {
        setLoading(false)
      }
    }

    if (pinId) {
      fetchPin()
    }
  }, [pinId])

  const handleCopyCode = () => {
    if (pin?.code) {
      navigator.clipboard.writeText(pin.code)
      setCopied(true)
      toast.success("Code copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getSandpackFiles = () => {
    if (!pin) return {}

    const { code } = pin
    const lang = (pin.lang || "").toLowerCase().replace(/^\./, "")

    const explicitlyReactLang = ["jsx", "tsx", "react", "typescriptreact", "react-ts"].includes(lang)

    // Strong HTML doc markers
    const strongHtmlDoc = /<!DOCTYPE/i.test(code) || /<(html|head|body)\b/i.test(code)
    // Generic HTML tags commonly seen in pasted snippets
    const hasHtmlTags = /<(div|span|button|a|p|ul|ol|li|section|article|main|header|footer|style|script)\b/i.test(code)

    const looksReactish =
      explicitlyReactLang ||
      /from\s+['"]react['"]/.test(code) ||
      /React\./.test(code) ||
      /export\s+default/.test(code) ||
      (/\breturn\s*\(/.test(code) && /\b(function|const|let|var)\b/.test(code))

    // Prefer static for any strong HTML document
    if (strongHtmlDoc) {
      return {
        "/index.html": { code, active: true },
      }
    }

    // If it looks like HTML and not clearly React, render as static HTML
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

    // Language-specific handling
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
            code: "body{font-family:Arial,sans-serif;margin:20px}h1{color:#333}",
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
            code: "body{font-family:Arial,sans-serif;margin:20px}h1{color:#333}",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (error || !pin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Preview Not Available</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">{error || "This pin could not be found or loaded."}</p>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Custom styles for Sandpack */}
      <style jsx global>{`
        .sp-wrapper {
          height: calc(100vh - 80px) !important;
        }
        .sp-layout {
          height: 100% !important;
        }
        .sp-editor {
          height: 100% !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
        }
        .sp-preview {
          height: 100% !important;
          overflow: auto !important;
        }
        .sp-preview-iframe {
          height: 100% !important;
          min-height: 100% !important;
        }
        /* Code editor text wrapping */
        .sp-editor .cm-editor {
          overflow-x: hidden !important;
        }
        .sp-editor .cm-scroller {
          overflow-x: hidden !important;
          overflow-y: auto !important;
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

      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
              <div>
                <h1 className="text-lg font-semibold">{pin.title}</h1>
                <p className="text-sm text-muted-foreground">Live Preview</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="flex items-center gap-2 bg-transparent"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy Code"}
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/pin/${pin.id}`} target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Pin
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="h-[calc(100vh-80px)] w-full">
        {!pin.code || pin.code.trim() === "" ? (
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
    </div>
  )
}
