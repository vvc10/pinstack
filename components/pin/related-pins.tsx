"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { Pin } from "@/types/pin"
import { PinCard } from "./pin-card"
import { MasonryPinterest } from "@/components/masonry-pinterest"

export function RelatedPins({ pin }: { pin: Pin }) {
  const [items, setItems] = useState<Pin[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const qs = useMemo(() => {
    const p = new URLSearchParams()
    p.set("cursor", "0")
    p.set("limit", "24")
    
    // Simple: Use ALL tags to find pins with same component type OR same tags
    if (pin.tags?.length) {
      p.set("tags", pin.tags.join(","))
    }
    
    return p.toString()
  }, [pin.tags])

  useEffect(() => {
    let alive = true
    async function run() {
      setLoading(true)
      try {
        const res = await fetch(`/api/pins?${qs}`)
        const json = await res.json()
        const list: Pin[] = (json?.items as Pin[]) || []
        
        // Simple: Remove current pin and show top 8
        const filtered = list.filter((p) => p.id !== pin.id).slice(0, 8)
        if (alive) setItems(filtered)
      } catch {
        if (alive) setItems([])
      } finally {
        if (alive) setLoading(false)
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [qs, pin.id])

  return (
    <section aria-label="Related Pins" className="mt-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">More like this</h3>
        <p className="text-sm text-muted-foreground">
          Discover similar components and designs
        </p>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : items.length ? (
        <MasonryPinterest
          items={items}
          renderItem={(pin) => <PinCard key={pin.id} pin={pin} />}
          gap={16}
          columns={{
            mobile: 1,
            tablet: 2,
            desktop: 3,
            xl: 4
          }}
        />
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No related pins found.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Try exploring other components in the same category
          </p>
        </div>
      )}
    </section>
  )
}
