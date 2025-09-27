"use client"

import React from 'react'
import { useLoading } from '@/contexts/loading-context'
import { Loader2 } from 'lucide-react'

export function UniversalLoader() {
  const { isLoading, loadingMessage } = useLoading()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Mini Loader */}
        <div className="relative">
          <div className="w-8 h-8 border-2 border-primary/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Loading Message */}
        {loadingMessage && (
          <p className="text-sm text-muted-foreground font-medium animate-pulse">
            {loadingMessage}
          </p>
        )}
      </div>
    </div>
  )
}

// Alternative compact loader for inline use
export function MiniLoader({ size = "sm", message }: { size?: "sm" | "md" | "lg", message?: string }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {message && (
        <p className="text-xs text-muted-foreground font-medium">
          {message}
        </p>
      )}
    </div>
  )
}

// Button loading state
export function ButtonLoader() {
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>Loading...</span>
    </div>
  )
}
