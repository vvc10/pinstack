"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

interface CreditsBadgeProps {
  credits: string
  className?: string
}

export function CreditsBadge({ credits, className }: CreditsBadgeProps) {
  return (
    <Badge 
      variant="secondary" 
      className={`text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground flex items-center gap-1 ${className || ''}`}
    >
      Credit: {credits}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => window.open('https://x.com/pankajstwt', '_blank')}
            className="hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
          >
            <Info className="h-3 w-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-center">
            If this UI is designed by you, please{" "}
            <button
              onClick={() => window.open('https://x.com/pankajstwt', '_blank')}
              className="underline font-medium hover:text-primary-foreground/80"
            >
              request credit
            </button>
          </p>
        </TooltipContent>
      </Tooltip>
    </Badge>
  )
}
