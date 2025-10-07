"use client"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

import { useEffect, useMemo, useRef, useState } from "react"
import useSWRInfinite from "swr/infinite"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { MasonryPinterest } from "@/components/masonry-pinterest"
import { MasonrySkeleton } from "@/components/skeletons/masonry-skeleton"
import { PinCard } from "@/components/pin/pin-card"
import { FiltersBar } from "@/components/filters-bar"
import { AppLayout } from "@/components/layout/app-layout"
import type { Pin } from "../../types/pin"

const fetcher = (url: string) => fetch(url).then((r) => r.json())
const PAGE_SIZE = 18

function HomePageContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  // State management
  const [searchQuery, setSearchQuery] = useState("")
  const [sort, setSort] = useState<"trending" | "most-voted" | "newest">("trending")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Initialize state from URL params
  useEffect(() => {
    setMounted(true)
    
    // Read URL params directly from window.location
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    const searchQuery = urlParams.get("q") ?? ""
    const sortParam = urlParams.get("sort") as any || "trending"
    const tagsParam = urlParams.get("category")
    
    setSearchQuery(searchQuery)
    setSort(sortParam)
    setSelectedTags(tagsParam ? tagsParam.split(",").filter(Boolean) : [])
  }, [pathname, searchParams])

  // Handle tag toggle
  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag) 
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    
    setSelectedTags(newTags)
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    if (newTags.length > 0) {
      params.set("category", newTags.join(","))
    } else {
      params.delete("category")
    }
    
    router.push(`/home?${params.toString()}`)
  }

  // Handle clear all
  const handleClearAll = () => {
    setSelectedTags([])
    setSearchQuery("")
    
    const params = new URLSearchParams(searchParams.toString())
    params.delete("category")
    params.delete("q")
    
    router.push(`/home?${params.toString()}`)
  }

  // Generate API key for SWR
  const getKey = (index: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.nextCursor) return null
    
    const cursor = previousPageData ? previousPageData.nextCursor : 0
    const params = new URLSearchParams({
      cursor: String(cursor),
      limit: String(PAGE_SIZE),
    })
    
    // Check URL directly on every call
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    const urlSearchQuery = urlParams.get("q") ?? ""
    
    // Use URL search query if available, otherwise use state
    const effectiveSearchQuery = urlSearchQuery || searchQuery
    
    // Add search query
    if (effectiveSearchQuery) {
      params.set("q", effectiveSearchQuery)
    }
    if (selectedTags.length > 0) params.set("category", selectedTags.join(","))
    if (sort) params.set("sort", sort)
    
    return `/api/pins?${params.toString()}`
  }

  const { data, error, isValidating, size, setSize, mutate } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
  })

  // Reset to first page when filters change
  useEffect(() => {
    setSize(1)
    mutate()
  }, [searchQuery, sort, selectedTags, setSize, mutate])

  const items: Pin[] = useMemo(() => 
    data ? data.flatMap((p: any) => p.items as Pin[]) : [], 
    [data]
  )
  
  const hasMore = useMemo(() => 
    Boolean(data?.[data.length - 1]?.nextCursor), 
    [data]
  )

  // Infinite scroll
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!hasMore) return
    const node = loadMoreRef.current
    if (!node) return
    
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0]
      if (first.isIntersecting) {
        setSize((s) => s + 1)
      }
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, setSize])

  const isInitialLoading = !data && !error

  if (!mounted) {
    return (
      <AppLayout currentTab="home" sort={sort} onSortChange={setSort}>
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded animate-pulse"></div>
          <MasonrySkeleton />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout currentTab="home" sort={sort} onSortChange={setSort}>
      <div className="space-y-6">
    
        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-sm text-destructive">Failed to load pins. Please try again.</p>
          </div>
        )}

        {/* Loading State */}
        {isInitialLoading ? (
          <MasonrySkeleton items={12} />
        ) : (
          <>
            {/* Results */}
            <MasonryPinterest
              items={items}
              renderItem={(pin) => (
                <PinCard
                  pin={pin}
                  onTagClick={(tag) => {
                    if (!selectedTags.includes(tag)) {
                      handleTagToggle(tag)
                    }
                  }}
                  onLangClick={(lang) => {
                    // Language filtering removed as requested
                  }}
                />
              )}
              gap={16}
              columns={{
                mobile: 1,
                tablet: 2,
                desktop: 3,
                xl: 4
              }}
            />

            {/* Load More Trigger */}
            <div ref={loadMoreRef} className="h-8" aria-hidden />
            
            {/* Loading More Indicator */}
            <div className="flex items-center justify-center py-6">
              {isValidating && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
                  Loading more pins...
                </div>
              )}
              {!hasMore && !isValidating && (
                <p className="text-sm text-muted-foreground">You're all caught up.</p>
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}

export default function HomePage() {
  return <HomePageContent />
}