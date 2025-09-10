"use client"

import { CreditsBadge } from "@/components/ui/credits-badge"

export default function TestCreditsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Credits Badge Test</h1>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Cases:</h2>
          
          <div className="flex items-center gap-4 flex-wrap">
            <CreditsBadge credits="@designer" />
            <CreditsBadge credits="Design Studio" />
            <CreditsBadge credits="UI/UX Team" />
            <CreditsBadge credits="John Doe" />
          </div>
          
          <div className="mt-8 p-4 border rounded-lg bg-muted/50">
            <h3 className="font-medium mb-2">Instructions:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Hover over the "i" icon to see the tooltip</li>
              <li>• Click the "i" icon or "request credit" text to open @pankajstwt's X profile</li>
              <li>• The tooltip should show: "If this UI is designed by you, please request credit"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
