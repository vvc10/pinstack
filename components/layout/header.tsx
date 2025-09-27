"use client"

import Link from "next/link"
import { useRef, useEffect, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Search, Menu, ArrowUpDown, Plus, LogOut, SquarePlay, Megaphone } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSidebar } from "@/components/board/boards-sidebar"
import { CreatePinModal } from "@/components/pin/create-pin-modal"
import { ReelsModal } from "@/components/reels/reels-modal"
import { NoticeBanner } from "@/components/ui/notice-banner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/contexts/auth-context"
import { useLoadingState } from "@/hooks/use-loading"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderProps {
  onMobileSidebarToggle: () => void
  sort?: "trending" | "most-voted" | "newest"
  onSortChange?: (v: "trending" | "most-voted" | "newest") => void
}

export function Header({ onMobileSidebarToggle, sort = "trending", onSortChange }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [q, setQ] = useState("")
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [reelsModalOpen, setReelsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const { isCollapsed } = useSidebar()
  const { user, signOut } = useAuth()
  const { startLoading, stopLoading } = useLoadingState()


  useEffect(() => {
    setMounted(true)
    // Initialize search query from URL parameters
    setQ(searchParams.get("q") ?? "")
  }, [searchParams])

  // Handle search changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (mounted) {
        const params = new URLSearchParams(searchParams.toString())

        // Update search query
        if (q.trim()) {
          params.set("q", q.trim())
        } else {
          params.delete("q")
        }

        // Navigate to home page with search params
        const newUrl = `/home?${params.toString()}`
        
        if (searchParams.toString() !== params.toString()) {
          startLoading("Searching...")
          router.push(newUrl)
        }
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [q, mounted, router, pathname, searchParams, startLoading])

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
      <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 left-0 right-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4 max-w-full">
          <div className="flex-1 min-w-0">
            <div className="relative w-full">
              <div className="w-full h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-12 h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="w-12 h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="w-12 h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="w-12 h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className={`border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/80 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isCollapsed ? 'md:left-16' : 'md:left-64'
        }`}>
        {/* Main Header Row */}
        <div className="container mx-auto px-6 py-2 flex items-center gap-4 max-w-full">

          {/* Large Search Bar with Sort Button - Takes up most of the width */}
          <div className="flex-1 min-w-0">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                ref={inputRef}
                aria-label="Search"
                placeholder="Search pins, tags, languages..."
                className="w-full pl-12 pr-16 py-3 rounded-2xl border border-border bg-zinc-100 dark:bg-zinc-800 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/0 focus:border-primary/0 transition-all duration-200"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    const params = new URLSearchParams(searchParams.toString())
                    if (q.trim()) {
                      params.set("q", q.trim())
                    } else {
                      params.delete("q")
                    }
                    const newUrl = `/home?${params.toString()}`
                    startLoading("Searching...")
                    router.push(newUrl)
                  }
                }}
              />

              {/* Sort Button - Inside search bar, right aligned */}
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

          {/* Desktop Buttons - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">

            {/* Add Button - Black with plus */}
            <Button
              size="icon"
              className="w-12 h-12 rounded-2xl cursor-pointer dark:bg-zinc-50 dark:text-zinc-900 hover:bg-[#222] shadow-sm"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="size-4 dark:text-zinc-900" />
            </Button>

            {/* Reels Button */}
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-2xl border border-border cursor-pointer text-zinc-500 hover:text-zinc-500 dark:text-zinc-400 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-muted transition-all duration-200"
              onClick={() => setReelsModalOpen(true)}
            >
              <SquarePlay className="size-4" />
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Authentication */}
            {user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-12 h-12 rounded-2xl border border-border cursor-pointer text-zinc-500 hover:text-zinc-500 dark:text-zinc-400 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-muted transition-all duration-200"
                  >
                    <Avatar className="h-6 w-6 rounded-xl">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                      <AvatarFallback className="rounded-full">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 rounded-2xl" align="end">
                  <div className="space-y-2">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.user_metadata?.full_name || user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start rounded-xl text-center"
                        onClick={() => signOut()}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-2xl border border-border cursor-pointer text-zinc-500 hover:text-zinc-500 dark:text-zinc-400 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-muted transition-all duration-200"
                asChild
              >
                <Link href="/sign-in">
                  <User className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-xl border border-border cursor-pointer text-zinc-500 hover:text-zinc-500 dark:text-zinc-400 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-muted transition-all duration-200"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
          <PopoverContent className="w-auto rounded-2xl p-3" align="end">
            <div className="flex items-center gap-3">
              {/* Create Button - Black with plus */}
              <Button
                size="icon"
                className="w-12 h-12 rounded-2xl cursor-pointer dark:bg-zinc-50 dark:text-zinc-900 hover:bg-[#222] shadow-sm"
                onClick={() => setCreateModalOpen(true)}
              >
                <Plus className="size-4 dark:text-zinc-900" />
              </Button>

              {/* Reels Button */}
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-2xl border border-border cursor-pointer text-zinc-500 hover:text-zinc-500 dark:text-zinc-400 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-muted transition-all duration-200"
                onClick={() => setReelsModalOpen(true)}
              >
                <SquarePlay className="size-4" />
              </Button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Authentication */}
              {user ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-12 h-12 rounded-2xl border border-border cursor-pointer text-zinc-500 hover:text-zinc-500 dark:text-zinc-400 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-muted transition-all duration-200"
                    >
                      <Avatar className="h-6 w-6 rounded-xl">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                        <AvatarFallback className="rounded-full">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 rounded-2xl" align="end">
                    <div className="space-y-2">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{user.user_metadata?.full_name || user.email}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start rounded-xl text-center"
                          onClick={() => signOut()}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-2xl border border-border cursor-pointer text-zinc-500 hover:text-zinc-500 dark:text-zinc-400 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-muted transition-all duration-200"
                  asChild
                >
                  <Link href="/sign-in">
                    <User className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Notice Banner */}
           <NoticeBanner
            message="New: Live preview feature 👀 - see your code, edit & see it in action!!"
            // icon={Megaphone}
            variant="info"
          />
       </header>

      {/* Create Pin Modal */}
      <CreatePinModal open={createModalOpen} onOpenChange={setCreateModalOpen} />

      {/* Reels Modal */}
      <ReelsModal open={reelsModalOpen} onOpenChange={setReelsModalOpen} />
    </>
  )
}
