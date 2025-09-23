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
      className={`text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground flex items-center gap-1 ${className || ''}`}
    >
       <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => window.open('https://x.com/pankajstwt', '_blank')}
            className="hover:bg-muted-foreground/0 rounded-full p-0.5 transition-colors"
          >
                Credit: {credits} 
       {/* <span className="text-xs bg-zinc-950 text-white rounded-sm px-1 py-0">𝕏</span> */}
    

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
