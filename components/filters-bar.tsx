"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

// Exact component types from create pin modal
const COMPONENT_TYPES = [
  "Hero", "Footer", "Navigation", "Sidebar", "Header", 
  "Carousel", "Slider", "Cards", "Accordions", "Tabs", "Modals / Dialogs",
  "Dropdowns", "Tooltips / Popovers", "Forms",
  "Search Bars", "Tables", "Grids", "Pagination", 
  "Buttons", "Alerts", "Toasts", "Badges", "Tags", "Chips",
  "dashboard", "landing", "pricing", "faq", "dark-mode", "minimal", "tailwind", "react"
]

const MAX_VISIBLE_TAGS = 8

interface FiltersBarProps {
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  onClearAll: () => void
}

export function FiltersBar({ selectedTags, onTagToggle, onClearAll }: FiltersBarProps) {
  const [showAllTags, setShowAllTags] = useState(false)
  const [tagCounts, setTagCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  
  // Fetch tag counts
  useEffect(() => {
    const fetchTagCounts = async () => {
      try {
        setLoading(true)
        const q = searchParams.get("q") || ""
        const response = await fetch(`/api/pins/tag-counts?q=${encodeURIComponent(q)}`)
        const data = await response.json()
        setTagCounts(data.counts || {})
      } catch (error) {
        console.error('Error fetching tag counts:', error)
        setTagCounts({})
      } finally {
        setLoading(false)
      }
    }

    fetchTagCounts()
  }, [searchParams])
  
  const visibleTags = showAllTags ? COMPONENT_TYPES : COMPONENT_TYPES.slice(0, MAX_VISIBLE_TAGS)
  const remainingCount = COMPONENT_TYPES.length - MAX_VISIBLE_TAGS

  return (
    <div className="space-y-3">
      {/* Component Types */}
      <div className="space-y-2">
         <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 md:flex-wrap md:overflow-x-visible md:pb-0">
          {visibleTags.map((tag) => {
            const isSelected = selectedTags.includes(tag)
            const count = tagCounts[tag] || 0
            const hasCount = !loading && count > 0
            
            return (
              <Button
                key={tag}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onTagToggle(tag)}
                className={`text-xs rounded-xl transition-all flex-shrink-0 ${
                  isSelected 
                    ? "bg-primary/80 text-primary-foreground shadow-sm cursor-pointer" 
                    : hasCount
                    ? "hover:bg-zinc-400 dark:hover:bg-zinc-600 cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }`}
                disabled={loading || (!hasCount && !isSelected)}
              >
                {tag} {hasCount && <span className="ml-1 opacity-70">{count}</span>}
              </Button>
            )
          })}
          
          {!showAllTags && remainingCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllTags(true)}
              className="text-xs rounded-xl text-muted-foreground hover:bg-transparent hover:text-zinc-600 dark:hover:bg-transparent dark:hover:text-zinc-400 cursor-pointer flex-shrink-0"
            >
              +{remainingCount} more
            </Button>
          )}
          
          {showAllTags && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllTags(false)}
              className="text-xs rounded-xl text-muted-foreground hover:bg-transparent hover:text-zinc-600 dark:hover:bg-transparent dark:hover:text-zinc-400 cursor-pointer flex-shrink-0"
            >
              Show less
            </Button>
          )}
        </div>
      </div>

      {/* Clear All Button */}
      {selectedTags.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs rounded-xl text-muted-foreground hover:bg-transparent hover:text-zinc-600 dark:hover:bg-transparent dark:hover:text-zinc-400 cursor-pointer"
            >
            Clear all ({selectedTags.length})
          </Button>
        </div>
      )}
    </div>
  )
}