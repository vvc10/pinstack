"use client"

import { useEffect, useMemo, useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Pin } from "@/types/pin"

type Props = {
  q: string
  lang: string
  tags: string[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function DiscoveryOrb({ q, lang, tags }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<Pin[]>([])

  const params = useMemo(() => {
    const p = new URLSearchParams()
    p.set("cursor", "0")
    p.set("limit", "30")
    if (q) p.set("q", q)
    if (lang && lang !== "all") p.set("lang", lang)
    if (tags.length) p.set("tags", tags.join(","))
    return p.toString()
  }, [q, lang, tags])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`/api/pins?${params}`)
      const json = await res.json()
      const list: Pin[] = (json?.items as Pin[]) || []
      // lightweight random subset up to 6
      const shuffled = [...list].sort(() => Math.random() - 0.5)
      setItems(shuffled.slice(0, 6))
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, params])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI Discovery suggestions"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-ring transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-4"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="AI Discovery suggestions"
          className="fixed bottom-20 right-5 z-40 w-[min(92vw,360px)] rounded-md border bg-popover text-popover-foreground shadow-lg"
        >
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <p className="text-sm font-medium">Discovery Suggestions</p>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close suggestions">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-3">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-12 w-16 rounded bg-muted animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                      <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : items.length ? (
              <ul className="space-y-3">
                {items.map((p) => (
                  <li key={p.id} className="flex gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image || "/placeholder.svg"}
                      alt={`Preview for ${p.title}`}
                      className="h-12 w-16 rounded object-cover border"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium line-clamp-2">{p.title}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {p.lang}
                        </span>
                        {p.tags.slice(0, 2).map((t) => (
                          <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {t}
                          </span>
                        ))}
                        {p.tags.length > 2 ? (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            +{p.tags.length - 2}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No suggestions. Try adjusting your filters.</p>
            )}
          </div>

          <div className="px-3 py-2 border-t flex items-center justify-end gap-2">
            <Button size="sm" variant="secondary" onClick={load}>
              Regenerate
            </Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
