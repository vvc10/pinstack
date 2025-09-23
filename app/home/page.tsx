"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import useSWRInfinite from "swr/infinite"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { MasonryPinterest } from "@/components/masonry-pinterest"
import { MasonrySkeleton } from "@/components/skeletons/masonry-skeleton"
import type { Pin } from "../../types/pin"
import { PinCard } from "@/components/pin/pin-card"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
// import { DiscoveryOrb } from "@/components/ai/discovery-orb"
import { AppLayout } from "@/components/layout/app-layout"
import { AuthGuard } from "@/components/auth/auth-guard"


const fetcher = (url: string) => fetch(url).then((r) => r.json())

function useDebounced<T>(value: T, delay = 350) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return v
}

const PAGE_SIZE = 18

function HomePageContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  const [q, setQ] = useState("")
  const [sort, setSort] = useState<"trending" | "most-voted" | "newest">("trending")

  useEffect(() => {
    setMounted(true)
    // Initialize state from search params after mounting
    setQ(searchParams.get("q") ?? "")
    setSort((searchParams.get("sort") as any) || "trending")
  }, [searchParams])

  useEffect(() => {
    const pin = searchParams.get("pin")
    if (pin) {
      router.replace(`/pin/${encodeURIComponent(pin)}`)
    }
  }, [router, searchParams])

  const getKey = (index: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.nextCursor) return null
    const cursor = previousPageData ? previousPageData.nextCursor : 0
    const params = new URLSearchParams({
      cursor: String(cursor),
      limit: String(PAGE_SIZE),
    })
    
    // Get filter values from URL params
    const urlQ = searchParams.get("q")
    const urlLang = searchParams.get("lang")
    const urlTags = searchParams.get("tags")
    const urlSort = searchParams.get("sort")
    
    if (urlQ) params.set("q", urlQ)
    if (urlLang && urlLang !== "all") params.set("lang", urlLang)
    if (urlTags) params.set("tags", urlTags)
    if (urlSort) params.set("sort", urlSort)
    
    return `/api/pins?${params.toString()}`
  }

  const { data, error, isValidating, size, setSize, mutate } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
  })

  useEffect(() => {
    setSize(1)
    mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, sort])

  useEffect(() => {
    const urlQ = searchParams.get("q") ?? ""
    const urlSort = (searchParams.get("sort") as "trending" | "most-voted" | "newest") || "trending"
    if (urlQ !== q) setQ(urlQ)
    if (urlSort !== sort) setSort(urlSort)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const items: Pin[] = useMemo(() => (data ? data.flatMap((p: any) => p.items as Pin[]) : []), [data])
  const hasMore = useMemo(() => Boolean(data?.[data.length - 1]?.nextCursor), [data])

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
  }, [hasMore, setSize, loadMoreRef])

  const isInitialLoading = !data && !error

  if (!mounted) {
    return (
      <AppLayout currentTab="home" sort={sort} onSortChange={setSort}>
        <div className="min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-balance">Discover Developer Pins</h1>
          </div>
          <div className="mb-5 overflow-hidden">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <MasonrySkeleton />

        </div>

      </AppLayout>
    )
  }

  return (
    <AppLayout currentTab="home" sort={sort} onSortChange={setSort}>
      <div>
        <div className="min-w-0" data-content-area>
          {error && <p className="text-sm text-destructive">Failed to load pins. Please try again.</p>}

          {isInitialLoading ? (
            <MasonrySkeleton items={12} />
          ) : (
            <MasonryPinterest
              items={items}
              renderItem={(pin) => (
                <PinCard
                  pin={pin}
                  onTagClick={(tag) => {
                    const currentTags = searchParams.get("tags")?.split(",").filter(Boolean) || []
                    if (!currentTags.includes(tag)) {
                      const newTags = [...currentTags, tag]
                      const params = new URLSearchParams(searchParams.toString())
                      params.set("tags", newTags.join(","))
                      router.push(`/?${params.toString()}`)
                    }
                  }}
                  onLangClick={(lang) => {
                    const params = new URLSearchParams(searchParams.toString())
                    if (lang === "all") {
                      params.delete("lang")
                    } else {
                      params.set("lang", lang)
                    }
                    router.push(`/?${params.toString()}`)
                  }}
                />
              )}
              className="mt-2"
              gap={16}
              columns={{
                mobile: 1,
                tablet: 2,
                desktop: 3,
                xl: 4
              }}
            />
          )}
          <div ref={loadMoreRef} className="h-8" aria-hidden />
          <div className="flex items-center justify-center py-6">
            {isValidating && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
                Loading more pins...
              </div>
            )}
            {!hasMore && !isValidating && <p className="text-sm text-muted-foreground">You&apos;re all caught up.</p>}
          </div>
        </div>
      </div>

      {/* Floating AI Discovery orb uses current q/lang/tags to suggest pins (mock) */}
      {/* <DiscoveryOrb 
        q={q} 
        lang={searchParams.get("lang") ?? "all"} 
        tags={searchParams.get("tags")?.split(",").filter(Boolean) || []}
      /> */}
    </AppLayout>
  )
}

export default function HomePage() {
  return (
    <AuthGuard>
      <HomePageContent />
    </AuthGuard>
  )
}
