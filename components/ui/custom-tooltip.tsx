"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface CustomTooltipProps {
  children: React.ReactNode
  content: string
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}

export function CustomTooltip({ 
  children, 
  content, 
  side = "top",
  className 
}: CustomTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => {
        console.log('Mouse enter - showing tooltip')
        setIsVisible(true)
      }}
      onMouseLeave={() => {
        console.log('Mouse leave - hiding tooltip')
        setIsVisible(false)
      }}
    >
      {children}
      
      {isVisible && (
        <div
          className={cn(
            "absolute z-[9999] px-2 py-1 text-xs font-medium rounded-lg",
            "bg-black text-white dark:bg-white dark:text-black",
            "pointer-events-none whitespace-nowrap",
            side === "top" && "-top-10 left-1/2 transform -translate-x-1/2",
            side === "bottom" && "-bottom-10 left-1/2 transform -translate-x-1/2",
            side === "left" && "top-1/2 -left-32 transform -translate-y-1/2",
            side === "right" && "top-1/2 -right-32 transform -translate-y-1/2",
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
