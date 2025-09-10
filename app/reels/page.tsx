"use client"

import { useEffect, useMemo, useRef } from "react"
import useSWRInfinite from "swr/infinite"
import { usePathname, useRouter } from "next/navigation"
import { VideoCard } from "@/components/reels/video-card"
import type { Pin } from "../../types/pin"

const fetcher = (url: string) => fetch(url).then((r) => r.json())
const PAGE_SIZE = 18

export default function ReelsPage() {
  const router = useRouter()
  const pathname = usePathname()

  const getKey = (index: number, prev: any) => {
    if (prev && !prev.nextCursor) return null
    const cursor = prev ? prev.nextCursor : 0
    const params = new URLSearchParams({ cursor: String(cursor), limit: String(PAGE_SIZE) })
    return `/api/pins?${params.toString()}`
  }

  const { data, error, isValidating, size, setSize } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
  })

  const pins: Pin[] = useMemo(() => (data ? data.flatMap((p: any) => p.items as Pin[]) : []), [data])
  const videos = pins.filter((p) => !!p.videoUrl)
  const hasMore = Boolean(data?.[data.length - 1]?.nextCursor)

  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!hasMore) return
    const node = loadMoreRef.current
    if (!node) return
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setSize((s) => s + 1)
    })
    obs.observe(node)
    return () => obs.disconnect()
  }, [hasMore, setSize])

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-xl md:text-2xl font-semibold mb-4 text-balance">Reels</h1>

      {error && <p className="text-sm text-destructive">Failed to load reels. Please try again.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {videos.map((v) => (
          <div key={v.id} className="space-y-2">
            <VideoCard title={v.title} src={v.videoUrl!} />
            <p className="text-sm">{v.title}</p>
          </div>
        ))}
      </div>

      <div ref={loadMoreRef} className="h-8" aria-hidden />

      <div className="flex items-center justify-center py-6">
        {isValidating && <p className="text-sm text-muted-foreground">Loading more reels…</p>}
        {!hasMore && !isValidating && <p className="text-sm text-muted-foreground">No more reels.</p>}
      </div>
    </main>
  )
}
