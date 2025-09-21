"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import { Sandpack } from '@codesandbox/sandpack-react'
import type { Pin } from '../../types/pin'

interface PreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pin: Pin | null
}

export function PreviewModal({ open, onOpenChange, pin }: PreviewModalProps) {
  const [loading, setLoading] = useState(true)

  // Set dark mode as default if no theme is set
  useEffect(() => {
    if (open) {
      // Only add dark mode if no theme is already set
      if (!document.documentElement.classList.contains('dark') && !document.documentElement.classList.contains('light')) {
        document.documentElement.classList.add('dark');
      }
    }
  }, [open]);

  const getSandpackFiles = () => {
    if (!pin) return {}
    
    const { code, lang } = pin
    
    // Auto-detect React components even if language is not set correctly
    const isReactComponent = code.includes('export default function') || 
                            code.includes('export default') || 
                            code.includes('function ') && code.includes('return (') ||
                            code.includes('const ') && code.includes('= () =>') ||
                            code.includes('jsx') || code.includes('JSX')
    
    // Use React template if it's a React component
    if (isReactComponent && lang.toLowerCase() !== 'react') {
      return {
        '/App.js': {
          code: code,
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
}

/* Button styles to replace shadcn Button */
button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: colors 0.2s;
  border: 1px solid transparent;
  cursor: pointer;
}

button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

button:disabled {
  pointer-events: none;
  opacity: 0.5;
}

/* Input styles to replace shadcn Input */
input {
  display: flex;
  height: 2.5rem;
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background-color: white;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
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

  const handleOpenInNewTab = () => {
    if (pin) {
      window.open(`/preview/${pin.id}`, '_blank')
    }
  }

  if (!pin) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80vw] w-[80vw] h-[80vh] p-0 overflow-hidden rounded-2xl" style={{ width: '80vw', maxWidth: '80vw', height: '80vh', maxHeight: '80vh' }}>
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
            <DialogTitle className="text-lg font-semibold flex-1 mr-4">
              {pin.title}  
            </DialogTitle>
            <div className="flex items-center gap-2 mr-12">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInNewTab}
                className="flex items-center gap-2 px-2 py-2 rounded-xl cursor-pointer"
              >
                <ExternalLink className="h-4 w-4" />
                Open
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 h-full overflow-hidden">
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
      </DialogContent>
    </Dialog>
  )
}
