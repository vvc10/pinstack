"use client"

import { useMinimalToast } from "@/hooks/use-minimal-toast"
import { Button } from "@/components/ui/button"

export default function ToastDemo() {
  const toast = useMinimalToast()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Minimal Toast Demo</h1>
          <p className="text-muted-foreground">Click buttons to see pill-like toast notifications</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => toast.success("Success!")}
            className="bg-green-600 hover:bg-green-700"
          >
            Success Toast
          </Button>
          
          <Button 
            onClick={() => toast.error("Error occurred")}
            className="bg-red-600 hover:bg-red-700"
          >
            Error Toast
          </Button>
          
          <Button 
            onClick={() => toast.info("Information")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Info Toast
          </Button>
          
          <Button 
            onClick={() => toast.warning("Warning!")}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            Warning Toast
          </Button>
          
          <Button 
            onClick={() => toast.default("Default message")}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Default Toast
          </Button>
          
          <Button 
            onClick={() => toast.success("Link copied")}
            className="bg-green-600 hover:bg-green-700"
          >
            Copy Success
          </Button>
        </div>

        <div className="bg-muted p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Features:</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Pill-shaped design with rounded corners</li>
            <li>• No descriptions - just clean titles</li>
            <li>• Color-coded by type (success, error, info, warning)</li>
            <li>• Backdrop blur effect</li>
            <li>• 3-second auto-dismiss</li>
            <li>• Minimal padding and compact size</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
