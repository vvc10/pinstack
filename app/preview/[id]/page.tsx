"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Sandpack } from '@codesandbox/sandpack-react'

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
    if (!document.documentElement.classList.contains('dark') && !document.documentElement.classList.contains('light')) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const fetchPin = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/pins/${pinId}`)
        if (!response.ok) {
          throw new Error('Pin not found')
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
          author: data.author
        }
        console.log('Pin loaded:', transformedPin)
        console.log('Code:', transformedPin.code)
        console.log('Language:', transformedPin.lang)
        setPin(transformedPin)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pin')
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
    
    const { code, lang } = pin
    console.log('Getting Sandpack files for:', { code: code?.substring(0, 100) + '...', lang })
    
    // Auto-detect React components even if language is not set correctly
    const isReactComponent = code.includes('export default function') || 
                            code.includes('export default') || 
                            code.includes('function ') && code.includes('return (') ||
                            code.includes('const ') && code.includes('= () =>') ||
                            code.includes('jsx') || code.includes('JSX')
    
    // Use React template if it's a React component
    if (isReactComponent && lang.toLowerCase() !== 'react') {
      console.log('Auto-detected React component, switching to React template')
      
      // Process the code to handle imports properly
      let processedCode = code;
      
      // Handle Lucide React imports - keep them as they are since we added the dependency
      if (code.includes('lucide-react')) {
        console.log('Detected Lucide React imports, keeping them as-is')
        // Keep the import statements as they are since we added lucide-react as a dependency
      }
      
      return {
        '/App.js': {
          code: processedCode,
          active: true,
        },
        '/styles.css': {
          code: `/* Custom styles for the component */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}`,
          active: false,
        },
      }
    }
    
    switch (lang.toLowerCase()) {
      case 'html':
        return {
          '/index.html': {
            code: code,
            active: true,
          },
        }
      case 'css':
        return {
          '/styles.css': {
            code: code,
            active: true,
          },
          '/index.html': {
            code: '<!DOCTYPE html>\n<html>\n<head>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <div>Your CSS styles will be applied here</div>\n</body>\n</html>',
          },
        }
      case 'javascript':
      case 'js':
        // Check if code has imports and handle them properly
        let processedCode = code;
        
        // If code has imports, we need to handle them differently
        if (code.includes('import ') || code.includes('require(')) {
          // For code with imports, create a proper module structure
          processedCode = `
// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  try {
    // Create a mock styles.css if imported
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = \`
        /* Add some basic styles */
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
      \`;
      document.head.appendChild(style);
    }
    
    ${code.replace(/import\s+["'].*["']\s*;?/g, '// Import statement removed for preview')}
  } catch (error) {
    console.error('Error executing code:', error);
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = '<div style="color: red; padding: 20px; border: 1px solid red; border-radius: 8px; margin: 20px;">Error: ' + error.message + '</div>';
    }
  }
});
          `.trim();
        } else {
          // For regular code without imports
          processedCode = `
// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  try {
    ${code}
  } catch (error) {
    console.error('Error executing code:', error);
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = '<div style="color: red; padding: 20px; border: 1px solid red; border-radius: 8px; margin: 20px;">Error: ' + error.message + '</div>';
    }
  }
});
          `.trim();
        }
        
        const wrappedJsCode = processedCode
        
        return {
          '/index.js': {
            code: wrappedJsCode,
            active: true,
          },
          '/index.html': {
            code: '<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Preview</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <div id="app"></div>\n  <script src="index.js"></script>\n</body>\n</html>',
          },
          '/styles.css': {
            code: '/* Basic styles for preview */\nbody { font-family: Arial, sans-serif; margin: 20px; }\nh1 { color: #333; }\n',
            active: false,
          },
        }
      case 'typescript':
      case 'ts':
        // Check if code has imports and handle them properly
        let processedTsCode = code;
        
        // If code has imports, we need to handle them differently
        if (code.includes('import ') || code.includes('require(')) {
          // For code with imports, create a proper module structure
          processedTsCode = `
// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  try {
    // Create a mock styles.css if imported
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = \`
        /* Add some basic styles */
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
      \`;
      document.head.appendChild(style);
    }
    
    ${code.replace(/import\s+["'].*["']\s*;?/g, '// Import statement removed for preview')}
  } catch (error) {
    console.error('Error executing code:', error);
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = '<div style="color: red; padding: 20px; border: 1px solid red; border-radius: 8px; margin: 20px;">Error: ' + error.message + '</div>';
    }
  }
});
          `.trim();
        } else {
          // For regular code without imports
          processedTsCode = `
// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  try {
    ${code}
  } catch (error) {
    console.error('Error executing code:', error);
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = '<div style="color: red; padding: 20px; border: 1px solid red; border-radius: 8px; margin: 20px;">Error: ' + error.message + '</div>';
    }
  }
});
          `.trim();
        }
        
        const wrappedTsCode = processedTsCode
        
        return {
          '/index.ts': {
            code: wrappedTsCode,
            active: true,
          },
          '/index.html': {
            code: '<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Preview</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <div id="app"></div>\n  <script type="module" src="index.ts"></script>\n</body>\n</html>',
          },
          '/styles.css': {
            code: '/* Basic styles for preview */\nbody { font-family: Arial, sans-serif; margin: 20px; }\nh1 { color: #333; }\n',
            active: false,
          },
        }
      case 'react':
        // Process the code to handle imports properly
        let processedReactCode = code;
        
        // Replace shadcn UI imports with standard HTML elements
        // First, split into lines and process each line
        const lines = processedReactCode.split('\n');
        const processedLines = lines.map(line => {
          // Remove shadcn UI imports
          if (line.includes('@/components/ui/')) {
            return ''; // Remove the entire line
          }
          return line;
        });
        processedReactCode = processedLines.join('\n');
        
        // Additional cleanup for any remaining imports
        processedReactCode = processedReactCode
          // Remove any remaining @/components imports
          .replace(/import\s*[^;]*@\/components[^;]*;?\s*/g, '')
          // Replace Button components
          .replace(/<Button\s+([^>]*)>/g, '<button $1>')
          .replace(/<\/Button>/g, '</button>')
          // Replace Input components
          .replace(/<Input\s+([^>]*)>/g, '<input $1>')
          .replace(/<\/Input>/g, '')
          // Replace Card components
          .replace(/<Card\s+([^>]*)>/g, '<div $1>')
          .replace(/<\/Card>/g, '</div>')
          // Replace Dialog components
          .replace(/<Dialog\s+([^>]*)>/g, '<div $1>')
          .replace(/<\/Dialog>/g, '</div>')
          // Replace other common shadcn components
          .replace(/<Badge\s+([^>]*)>/g, '<span $1>')
          .replace(/<\/Badge>/g, '</span>')
          .replace(/<Label\s+([^>]*)>/g, '<label $1>')
          .replace(/<\/Label>/g, '</label>')
          .replace(/<Textarea\s+([^>]*)>/g, '<textarea $1>')
          .replace(/<\/Textarea>/g, '</textarea>')
          .replace(/<Select\s+([^>]*)>/g, '<select $1>')
          .replace(/<\/Select>/g, '</select>')
          .replace(/<Checkbox\s+([^>]*)>/g, '<input type="checkbox" $1>')
          .replace(/<\/Checkbox>/g, '')
          .replace(/<RadioGroup\s+([^>]*)>/g, '<div $1>')
          .replace(/<\/RadioGroup>/g, '</div>')
          .replace(/<RadioGroupItem\s+([^>]*)>/g, '<input type="radio" $1>')
          .replace(/<\/RadioGroupItem>/g, '');
        
        // Handle Lucide React imports - keep them as they are since we added the dependency
        if (code.includes('lucide-react')) {
          console.log('Detected Lucide React imports in React case, keeping them as-is')
          // Keep the import statements as they are since we added lucide-react as a dependency
        }
        
        // Debug: Log the processed code to see what's happening
        console.log('Original code:', code.substring(0, 200));
        console.log('Processed code:', processedReactCode.substring(0, 200));
        
        return {
          '/App.js': {
            code: processedReactCode,
            active: true,
          },
          '/styles.css': {
            code: `/* Custom styles for the component */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}`,
            active: false,
          },
        }
      case 'vue':
        return {
          '/App.vue': {
            code: code,
            active: true,
          },
        }
      case 'svelte':
        return {
          '/App.svelte': {
            code: code,
            active: true,
          },
        }
      default:
        return {
          '/index.html': {
            code: `<pre><code>${code}</code></pre>`,
            active: true,
          },
        }
    }
  }

  const getTemplate = () => {
    if (!pin) return 'vanilla'
    
    // Auto-detect React components
    const isReactComponent = pin.code.includes('export default function') || 
                            pin.code.includes('export default') || 
                            pin.code.includes('function ') && pin.code.includes('return (') ||
                            pin.code.includes('const ') && pin.code.includes('= () =>') ||
                            pin.code.includes('jsx') || pin.code.includes('JSX')
    
    if (isReactComponent) {
      return 'react'
    }
    
    switch (pin.lang.toLowerCase()) {
      case 'react':
        return 'react'
      case 'vue':
        return 'vue'
      case 'svelte':
        return 'svelte'
      default:
        return 'vanilla'
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
            <p className="text-muted-foreground">
              {error || 'This pin could not be found or loaded.'}
            </p>
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
                className="flex items-center gap-2"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? 'Copied!' : 'Copy Code'}
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
        <Sandpack
          template={getTemplate()}
          files={getSandpackFiles()}
          options={{
            showNavigator: false,
            showTabs: true,
            showLineNumbers: true,
            showInlineErrors: true,
            wrapContent: true,
            editorHeight: '100%',
            editorWidthPercentage: 40,
            externalResources: [
              'https://cdn.tailwindcss.com'
            ],
            initMode: 'lazy'
          }}
          customSetup={{
            dependencies: {
              'lucide-react': 'latest',
              'react': '^18.0.0',
              'react-dom': '^18.0.0'
            }
          }}
          theme="dark"
        />
      </div>
    </div>
  )
}
