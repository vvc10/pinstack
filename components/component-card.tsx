"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Code, Play } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { LoginModal } from "@/components/auth/login-modal"
import { PlaygroundModal } from "@/components/playground/playground-modal"
import { useAuth } from "@/contexts/auth-context"

interface ComponentCardProps {
  component: {
    src: string | null
    alt: string
    isComingSoon?: boolean
  }
}

export function ComponentCard({ component }: ComponentCardProps) {
  const [copied, setCopied] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [playgroundModalOpen, setPlaygroundModalOpen] = useState(false)
  const { user } = useAuth()

  const handleCopyCode = () => {
    navigator.clipboard.writeText("Please login to copy actual code");
    setCopied(true)
    toast.success("📋 Code Copied!", {
      description: "Component code has been copied to clipboard",
      duration: 3000,
    })
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const handleSave = () => {
    setLoginModalOpen(true)
  }

  const handlePlayCode = () => {
    if (!user) {
      setLoginModalOpen(true)
    } else {
      setPlaygroundModalOpen(true)
    }
  }

  return (
    <article
      className="group relative overflow-hidden rounded-2xl bg-card text-card-foreground shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_0_2px_rgba(139,92,246,0.6)]"
      style={{
        // Add a subtle border for better definition
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* Image Container */}
      <div className="relative block w-full text-left">
        {component.isComingSoon ? (
          <div className="w-full h-64 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center rounded-t-2xl relative">
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-600 dark:text-zinc-400 mb-2">
                Arriving Soon
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-500 mb-4">
                New components coming
              </div>
              {!user && (
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-3 py-1 h-7 rounded-lg cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    setLoginModalOpen(true)
                  }}
                >
                  Join now
                </Button>
              )}
            </div>
          </div>
        ) : (
          <img
            src={component.src!}
            alt={component.alt}
            className="w-full h-auto"
          />
        )}
        

        {/* Center Action Buttons - Visible on Hover (only for regular components) */}
        {!component.isComingSoon && (
          <div 
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none"
          >
            <div className="flex items-center gap-2">
              {/* Copy Button */}
              <Button
                size="icon"
                variant="secondary"
                className={`h-fit w-fit px-2 py-2 rounded-xl shadow-lg backdrop-blur-sm z-20 transition-all duration-200 cursor-pointer hover:scale-110 pointer-events-auto dark:bg-zinc-200 ${
                  copied 
                    ? 'bg-green-500/90 hover:bg-green-500 text-white' 
                    : 'bg-card/90 hover:bg-card'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopyCode()
                }}
                aria-label={copied ? "Copied!" : "Copy code"}
              >
                {copied ? (
                  <div className="flex items-center gap-1 dark:text-zinc-800">
                    <Check className="h-4 w-4" />
                    <span className="text-xs font-medium">Copied</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 dark:text-zinc-800">
                    <Code className="h-4 w-4" />
                    <span className="text-xs font-medium">Copy</span>
                  </div>
                )}
              </Button>

              {/* Play Code Button */}
              <Button
                size="icon"
                variant="secondary"
                className="h-fit w-fit px-2 py-2 rounded-xl shadow-lg backdrop-blur-sm z-20 transition-all duration-200 cursor-pointer hover:scale-110 pointer-events-auto dark:bg-zinc-200 bg-card/90 hover:bg-card"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePlayCode()
                }}
                aria-label="Play with code"
              >
                <div className="flex items-center gap-2 dark:text-zinc-800">
                  <Play className="h-4 w-4" />
                  <span className="text-xs font-medium">Play</span>
                </div>
              </Button>
            </div>
          </div>
        )}

        {/* Bottom Right Save Button - Visible on Hover (only for regular components) */}
        {!component.isComingSoon && (
          <div 
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none"
          >
            <Button
              size="sm"
              className="h-9 px-4 rounded-2xl shadow-lg font-medium flex-shrink-0 z-20 cursor-pointer hover:scale-105 transition-all duration-200 pointer-events-auto bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={(e) => {
                e.stopPropagation()
                handleSave()
              }}
              aria-label="Save component"
            >
              Save
            </Button>
          </div>
        )}
      </div>


      {/* Login Modal */}
      <LoginModal 
        open={loginModalOpen} 
        onOpenChange={setLoginModalOpen} 
      />

      {/* Playground Modal */}
      <PlaygroundModal 
        open={playgroundModalOpen} 
        onOpenChange={setPlaygroundModalOpen}
        pin={{
          id: "1",
          title: component.alt,
          description: "Interactive component playground",
          code: `// ${component.alt} Component
import React from 'react';

const ${component.alt.replace(/\s+/g, '')} = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">${component.alt}</h2>
      <p className="text-gray-600 mb-4">
        This is a beautiful ${component.alt.toLowerCase()} component.
      </p>
      <button 
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        onClick={() => alert('Hello from ${component.alt}!')}
      >
        Click me
      </button>
    </div>
  );
};

export default ${component.alt.replace(/\s+/g, '')};`,
          lang: "javascript",
          tags: ["react", "component", "ui"],
          author_id: "1",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_public: true,
          likes_count: 0,
          saves_count: 0,
          views_count: 0
        }}
      />
    </article>
  )
}
