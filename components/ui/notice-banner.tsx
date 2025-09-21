"use client"

import { X, Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNoticeBanner } from "@/contexts/notice-banner-context"
import { LucideIcon } from "lucide-react"

interface NoticeBannerProps {
  message: string
  icon?: LucideIcon
  variant?: "default" | "info" | "success" | "warning" | "error"
  dismissible?: boolean
  onDismiss?: () => void
}

export function NoticeBanner({ 
  message, 
  icon: Icon = Megaphone,
  variant = "default", 
  dismissible = true,
  onDismiss 
}: NoticeBannerProps) {
  const { isVisible, setIsVisible } = useNoticeBanner()

  console.log("NoticeBanner render:", { isVisible, message })

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) {
    console.log("NoticeBanner: Not visible, returning null")
    return null
  }

  const variantStyles = {
    default: "bg-primary/10 text-primary border-primary/20",
    info: "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    success: "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    warning: "bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
    error: "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
  }

  return (
    <div className={`w-full border rounded-xl px-4 py-3 flex items-center justify-between gap-3 ${variantStyles[variant]}`}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="text-sm font-medium truncate">{message}</span>
      </div>
      
      {dismissible && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-6 w-6 p-0 hover:bg-black/10 dark:hover:bg-white/10 flex-shrink-0"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
