"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, X } from "lucide-react"

interface CreditsBadgeProps {
  credits: string
  className?: string
}

export function CreditsBadge({ credits, className }: CreditsBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={`text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground flex items-center gap-1.5 ${className || ''}`}
    >
      <button
        onClick={() => window.open(`https://x.com/${credits}`, '_blank')}
        className="hover:bg-muted-foreground/0 cursor-pointer rounded-full p-0.5 transition-colors duration-200"
      >
        via @{credits}
      </button>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="hover:bg-muted-foreground/10 rounded-full p-0.5 transition-colors duration-200">
            <Info className="h-3 w-3 opacity-60" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs mb-2">
          <p className="text-center">
            If this UI is designed by you, please{" "}
            <button
              onClick={() => window.open('https://x.com/pankajstwt', '_blank')}
              className="underline font-medium hover:underline cursor-pointer transition-colors"
            >
              request credit
            </button>
          </p>
        </TooltipContent>
      </Tooltip>
    </Badge>
  )
}
