"use client"

import { useRef, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, ArrowUpDown } from "lucide-react"
import { useLoadingState } from "@/hooks/use-loading"

export function SearchBarBox({ sort = "trending", onSortChange }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const inputRef = useRef(null)
    const [q, setQ] = useState("")
    const [mounted, setMounted] = useState(false)
    const [sortOpen, setSortOpen] = useState(false)
    const { startLoading } = useLoadingState()

    const safeSearchParams = searchParams || new URLSearchParams()

    useEffect(() => {
        setMounted(true)
        setQ(safeSearchParams.get("q") ?? "")
    }, [safeSearchParams])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (mounted) {
                const params = new URLSearchParams(safeSearchParams.toString())
                if (q.trim()) params.set("q", q.trim())
                else params.delete("q")

                const newUrl = `/home?${params.toString()}`
                if (safeSearchParams.toString() !== params.toString()) {
                    startLoading("Searching...")
                    router.push(newUrl)
                }
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [q, mounted, router, safeSearchParams, startLoading])

    useEffect(() => {
        const onKey = (e) => {
            const tag = (e.target?.tagName || "").toLowerCase()
            if (tag === "input" || tag === "textarea" || e.isComposing) return
            if (e.key === "/") {
                e.preventDefault()
                inputRef.current?.focus()
            }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [])

    return (
        <div className="rounded-2xl h-[250px] border-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 text-foreground dark:text-white overflow-hidden relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>
  
            <div className="relative w-[90%] mx-auto mt-12">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <input
                    ref={inputRef}
                    aria-label="Search"
                    placeholder="Search pins, tags, languages..."
                    className="w-full pl-12 pr-16 py-3 rounded-2xl border border-border bg-zinc-100 dark:bg-zinc-800 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/0 focus:border-primary/0 transition-all duration-200"
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

                {/* Sort Popover */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Popover open={sortOpen} onOpenChange={setSortOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-10 h-10 rounded-xl bg-transparent hover:bg-muted/50 border-0"
                            >
                                <ArrowUpDown className="size-4 text-muted-foreground" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-1" align="end">
                            <div className="space-y-1">
                                <button
                                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${sort === "trending" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                                        }`}
                                    onClick={() => {
                                        onSortChange?.("trending")
                                        setSortOpen(false)
                                    }}
                                >
                                    Trending
                                </button>
                                <button
                                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${sort === "most-voted" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                                        }`}
                                    onClick={() => {
                                        onSortChange?.("most-voted")
                                        setSortOpen(false)
                                    }}
                                >
                                    Most Voted
                                </button>
                                <button
                                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${sort === "newest" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                                        }`}
                                    onClick={() => {
                                        onSortChange?.("newest")
                                        setSortOpen(false)
                                    }}
                                >
                                    Newest
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>

    )
}
