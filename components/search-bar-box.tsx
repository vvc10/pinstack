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
      className={`w-full transition-all duration-300  ease-in-out ${
        isScrolled
          ? "fixed w-fit top-0 left-0 right-0 z-50 rounded-[0px] backdrop-blur-none bg-zinc-100/50 dark:bg-zinc-800/50 h-16 py-2"
          : "relative h-[100px] py-2 rounded-2xl"
      } border-0 text-foreground dark:text-white overflow-hidden`}
 
    >
   <div
  className={`absolute transition-all duration-300 ${
    isScrolled
      ? "w-[90%] sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-[70%] 2xl:w-[80%] ml-4"
      : "w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[70%] ml-auto bottom-8"
  }`}
>

        <Search
          className={`size-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
            isScrolled ? "size-4" : ""
          }`}
        />
        <input
          ref={inputRef}
          aria-label="Search"
          placeholder="Search pins, tags, languages..."
          className={`w-full rounded-2xl border-2 bg-zinc-50 border-zinc-300/30 dark:border-zinc-300/5 dark:bg-zinc-800/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-to-r focus:ring-from-purple-500 focus:ring-to-blue-500 transition-all duration-200 ${
            isScrolled ? "pl-10 pr-12 py-3 text-sm" : "pl-12 pr-16 py-3 text-base"
          }`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E')`,
          }}
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
          className={`absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-300 ${
            isScrolled ? "right-1" : ""
          }`}
        >
          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-xl bg-transparent hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 border-0 transition-all duration-200 ${
                  isScrolled ? "w-8 h-8" : "w-10 h-10"
                }`}
              >
                <ArrowUpDown
                  className={`text-muted-foreground ${isScrolled ? "size-3" : "size-4"}`}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className={`w-40 p-1 bg-zinc-100/80 dark:bg-zinc-800/80 backdrop-blur-md`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E')`,
              }}
            >
              <div className="space-y-1">
                {["trending", "most-voted", "newest"].map((type) => (
                  <button
                    key={type}
                    className={`w-full text-left px-3 py-2 rounded-md capitalize transition-colors ${
                      sort === type
                        ? "bg-zinc-400/50 dark:bg-zinc-700/50 text-zinc-700 dark:text-zinc-100"
                        : "hover:bg-zinc-400/50 hover:dark:bg-zinc-700/50"
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