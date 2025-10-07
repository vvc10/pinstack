"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, ArrowUpDown } from "lucide-react"
import { useLoadingState } from "@/hooks/use-loading"

interface SearchBoxBarProps {
  sort?: "trending" | "most-voted" | "newest"
  onSortChange?: (v: "trending" | "most-voted" | "newest") => void
  isScrolled?: boolean
}

export function SearchBoxBar({ sort = "trending", onSortChange, isScrolled }: SearchBoxBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { startLoading } = useLoadingState()

  const inputRef = useRef<HTMLInputElement | null>(null)
  const [q, setQ] = useState("")
  const [mounted, setMounted] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  // Handle SSR case
  const safeSearchParams = searchParams || new URLSearchParams()

  // Set mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Debounce search query updates
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (mounted) {
        const params = new URLSearchParams(safeSearchParams.toString())
        if (q.trim()) {
          params.set("q", q.trim())
        } else {
          params.delete("q")
        }

        const newUrl = `/home?${params.toString()}`
        if (safeSearchParams.toString() !== params.toString()) {
          startLoading("Searching...")
          router.push(newUrl)
        }
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [q, mounted, router, pathname, safeSearchParams, startLoading])

  // Shortcut key `/` to focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase()
      if (tag === "input" || tag === "textarea" || (e as any).isComposing) return
      if (e.key === "/") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  if (!mounted) {
    return (
      <div className="relative w-full">
        <div className="w-full h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>
    )
  }

  return (
    <div
      className={`w-full transition-all duration-300 ease-in-out ${
        isScrolled
          ? "fixed w-fit top-0 left-0 right-0 z-50 rounded-none bg-background/0 h-14 py-2"
          : "relative h-[80px] md:h-[70px] py-2"
      } overflow-hidden`}
    >
      <div
        className={`relative md:relative mx-auto transition-all duration-300 ${
          isScrolled
            ? "w-[80%] sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-[70%] 2xl:w-[80%] ml-[60px] md:ml-4"
            : "w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[70%] mx-auto"
        }`}
      >
        <Search
          className={`size-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
            isScrolled ? "size-4" : ""
          }`}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          aria-label="Search"
          placeholder="Search pins, tags, languages..."
          className={`w-full rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-200 shadow-sm ${
            isScrolled ? "pl-10 pr-14 py-3 text-sm" : "pl-12 pr-20 py-3.5 text-base"
          }`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              const params = new URLSearchParams(safeSearchParams.toString())
              if (q.trim()) params.set("q", q.trim())
              else params.delete("q")

              const newUrl = `/home?${params.toString()}`
              startLoading("Searching...")
              router.push(newUrl)
            }
          }}
        />
        <div
          className={`absolute right-10 top-1/2 -translate-y-1/2 hidden md:flex items-center text-muted-foreground ${
            isScrolled ? "right-8" : "right-10"
          }`}
          aria-hidden="true"
        >
          <span className="inline-flex mr-3 items-center rounded-xl border border-border bg-muted px-4 py-3 text-[11px] leading-none">
            /
          </span>
        </div>
        <div
          className={`absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-300 ${
            isScrolled ? "right-1" : ""
          }`}
        >
          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Sort"
                aria-expanded={sortOpen}
                className="inline-flex items-center rounded-xl border border-border bg-muted px-4 py-3 text-[11px] leading-none"
              >
                <ArrowUpDown className={`text-muted-foreground ${isScrolled ? "size-3" : "size-4"}`} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-1 bg-popover border border-border rounded-xl">
              <div className="space-y-1">
                {["trending", "most-voted", "newest"].map((type) => (
                  <button
                    key={type}
                    className={`w-full text-left px-3 py-2 rounded-md capitalize transition-colors ${
                      sort === type ? "bg-muted text-foreground" : "hover:bg-muted"
                    } ${isScrolled ? "text-xs py-1.5" : "text-sm"}`}
                    onClick={() => {
                      onSortChange?.(type as any)
                      setSortOpen(false)
                    }}
                  >
                    {type.replace("-", " ")}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
    </div>
  )
}
