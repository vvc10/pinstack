"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

const LANGS = ["all", "javascript", "typescript", "python", "css", "go", "rust", "sql"]
const TAGS = [
  // Component Categories
  "Hero", "Footer", "Navigation", "Sidebar", "Header", 
  "Carousel", "Slider", "Cards", "Accordions", "Tabs", "Modals / Dialogs",
  "Dropdowns", "Tooltips / Popovers", "Forms",
  "Search Bars", "Tables","Grids", "Pagination", 
  "Buttons", "Alerts",  "Toasts","Badges", "Tags", "Chips",
  "dashboard", "landing", "pricing", "faq", "dark-mode", "minimal", "tailwind", "react"
]
const MAX_VISIBLE_TAGS = 8

export type FiltersState = {
  lang: string
  tags: string[]
  sort: "trending" | "most-voted" | "newest"
}

export function FiltersBar({
  lang,
  onLangChange,
  tags,
  onToggleTag,
  onClear,
}: {
  lang: string
  onLangChange: (v: string) => void
  tags: string[]
  onToggleTag: (tag: string) => void
  onClear: () => void
}) {
  const [showAllTags, setShowAllTags] = useState(false)
  
  const visibleTags = showAllTags ? TAGS : TAGS.slice(0, MAX_VISIBLE_TAGS)
  const remainingCount = TAGS.length - MAX_VISIBLE_TAGS

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 transition-all duration-300 ease-in-out">
            {visibleTags.map((t, index) => {
              const active = tags.includes(t)
              return (
                <Button
                  key={t}
                  size="sm"
                  variant={active ? "default" : "secondary"}
                  onClick={() => onToggleTag(t)}
                  aria-pressed={active}
                  className="text-xs flex-shrink-0 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 dark:bg-muted dark:hover:bg-secondary dark:text-foreground dark:hover:text-foreground dark:active:bg-primary/50 dark:focus:bg-primary/50"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: showAllTags ? 'fadeInUp 0.3s ease-out forwards' : 'none'
                  }}
                >
                  {t}
                </Button>
              )
            })}
            
            {!showAllTags && remainingCount > 0 && (
              <Button
              size="sm"
              variant="ghost"
                onClick={() => setShowAllTags(true)}
                className="text-xs flex-shrink-0 text-foreground hover:text-foreground dark:text-foreground dark:hover:text-foreground cursor-pointer  hover:bg-transparent dark:hover:bg-transparent transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
             
               >
                +{remainingCount}
              </Button>
            )}
            
            {showAllTags && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowAllTags(false)}
                className="text-xs flex-shrink-0 text-foreground hover:text-foreground dark:text-foreground dark:hover:text-foreground hover:bg-transparent dark:hover:bg-transparent transition-all cursor-pointer duration-200 ease-in-out hover:scale-105 active:scale-95"
                >
                Show less
              </Button>
            )}
          </div>
        </div>
        
        {tags.length > 0 && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClear} 
              aria-label="Clear filters" 
              className="text-xs transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 hover:bg-destructive/10 hover:text-destructive"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
