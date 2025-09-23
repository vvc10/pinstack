"use client"

import Link from "next/link"
import { useState } from "react"
import { 
  Home, 
  Clock, 
  Bookmark,
  LayoutDashboard,
  MoreHorizontal,
  HelpCircle,
  Lightbulb
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface MobileBottomNavProps {
  currentTab?: string
}

export function MobileBottomNav({ currentTab = "home" }: MobileBottomNavProps) {
  const [moreOpen, setMoreOpen] = useState(false)
  
  const navItems = [
    {
      href: "/home",
      icon: Home,
      label: "Home",
      tab: "home"
    },
    {
      href: "/recent", 
      icon: Clock,
      label: "Recent",
      tab: "recent"
    },
    {
      href: "/yourpins",
      icon: Bookmark,
      label: "Your Pins", 
      tab: "yourpins"
    },
    {
      href: "/boards",
      icon: LayoutDashboard,
      label: "Boards",
      tab: "boards"
    }
  ]

  const handleHelpClick = () => {
    window.open("https://x.com/pankajstwt", "_blank", "noopener,noreferrer")
    setMoreOpen(false)
  }

  const handleSuggestionClick = () => {
    // This will be handled by the parent component or context
    // For now, we'll just close the popover
    setMoreOpen(false)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-[9999] md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentTab === item.tab
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
        
        {/* More Button */}
        <Popover open={moreOpen} onOpenChange={setMoreOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors text-muted-foreground hover:bg-muted"
            >
              <MoreHorizontal className="h-5 w-5 flex-shrink-0" />
              <span className="text-xs font-medium">More</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 rounded-2xl mb-2" align="center">
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start rounded-xl"
                onClick={handleHelpClick}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Help Center
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start rounded-xl"
                onClick={handleSuggestionClick}
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                Suggestion
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
