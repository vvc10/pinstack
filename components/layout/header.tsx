"use client"

import Link from "next/link"
import { useRef, useEffect, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { User, Menu, Plus, LogOut, SquarePlay, Megaphone } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSidebar } from "@/components/board/boards-sidebar"
import { CreatePinModal } from "@/components/pin/create-pin-modal"
import { ReelsModal } from "@/components/reels/reels-modal"
import { NoticeBanner } from "@/components/ui/notice-banner"
import { LoginModal } from "@/components/auth/login-modal"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/contexts/auth-context"
import { useLoadingState } from "@/hooks/use-loading"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SearchBoxBar } from "@/components/search-bar-box"

interface HeaderProps {
  onMobileSidebarToggle: () => void
  sort?: "trending" | "most-voted" | "newest"
  onSortChange?: (v: "trending" | "most-voted" | "newest") => void
}

export function Header({ onMobileSidebarToggle, sort = "trending", onSortChange }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [reelsModalOpen, setReelsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const { isCollapsed } = useSidebar()
  const { user, signOut } = useAuth()
  const { startLoading, stopLoading } = useLoadingState()
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle case where searchParams might not be available during SSR
  const safeSearchParams = searchParams || new URLSearchParams()

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 50 // Reduced threshold for quicker response
      setIsScrolled(window.scrollY > scrollThreshold)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 left-0 right-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4 max-w-full">
          <div className="flex-1 min-w-0">
            <div className="w-full h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
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
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isCollapsed ? "md:left-16" : "md:left-64"
          } ${isScrolled
            ? "bg-zinc-100/20 dark:bg-zinc-800/20 m-0 p-0 backdrop-blur-lg rounded-none"
            : "bg-gradient-to-br m-2 sm:m-3 md:m-4 from-pink-600/25 via-violet-600/25 to-rose-600/25 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 90 90%22%3E%3Cfilter id=%22grain%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%221%22 /%3E%3CfeColorMatrix type=%22saturate%22 values=%220%22 /%3E%3C/filter%3E%3Crect width=%2290%22 height=%2290%22 filter=%22url(%23grain)%22 opacity=%220.15%22 /%3E%3C/svg%3E')] bg-blend-soft-light"
          } backdrop-blur-md supports-[backdrop-filter]:bg-background/60 rounded-2xl`}
      >
        <div
          className={`container mx-auto transition-all duration-300 ease-in-out flex items-center justify-between gap-2 sm:gap-3 md:gap-4 max-w-full px-2 sm:px-3 md:px-4 ${isScrolled ? "py-2 sm:py-2.5" : "py-3 sm:py-4"
            }`}
        >
          {/* Search Section */}
          <div className="flex-1 p-4">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-semibold font-garamond tracking-tight mb-4 ${isScrolled ? "hidden" : "block"}`}>
              Premium UI Components, <span className="text-transparent bg-clip-text  bg-purple-500">Ready to Copy</span>.
            </h2>
            <p className={`text-zinc-600 dark:text-zinc-400 text-sm w-[80%] sm:text-base md:text-lg leading-relaxed ${isScrolled ? "hidden" : "block"}`}>
              Explore a curated collection of high-quality, production-ready UI elements built with modern design principles — crafted to help you build faster and design smarter.
            </p>
            <SearchBoxBar sort={sort} onSortChange={onSortChange} isScrolled={isScrolled} />
            <p
              className={`text-zinc-600 items-center dark:text-zinc-400 text-[14px] w-[80%] sm:text-base md:text-lg leading-relaxed transition-all duration-300 ${isScrolled ? "hidden" : "block"
                }`}
            >
                 {!isScrolled && (
              <div className="flex flex-row gap-2 w-fit">
                {/* Profile Avatars */}
                <div className="flex -space-x-2">
                  <img
                    src="https://pbs.twimg.com/profile_images/1952423493879894017/M6tZ4PC0_400x400.jpg"
                    alt="User 1"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white dark:border-zinc-800"
                  />
                  <img
                    src="https://i.pinimg.com/1200x/2c/36/44/2c364466678be55dfacfe65c673844c1.jpg"
                    alt="User 2"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white dark:border-zinc-800"
                  />
                  <img
                    src="https://i.pinimg.com/1200x/0b/89/b5/0b89b5c2804c1c4dd5b82a4d2c7a1396.jpg"
                    alt="User 3"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white dark:border-zinc-800"
                  />
              
                </div>

                {/* Text */}
                <span className="text-xs sm:text-base italic h-fit my-auto text-zinc-700 dark:text-zinc-300 font-normal">
                  110+ creatives on it! 
                </span>
              </div>
            )}
            </p>

      
          </div>

          {/* Desktop Action Buttons */}
          <div
            className={`hidden md:flex z-50 items-center gap-2 sm:gap-3 flex-shrink-0 transition-all duration-300 ${isScrolled ? "relative" : "absolute right-4 sm:right-6 top-3 sm:top-4"
              }`}
          >
            <Button
              size="icon"
              className="w-10 sm:w-11 md:w-12 h-10 sm:h-11 md:h-12 rounded-2xl cursor-pointer text-zinc-200 dark:text-zinc-200 bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-200 dark:hover:bg-zinc-300 transition-all duration-200"
              onClick={() => {
                if (!user) return setLoginModalOpen(true)
                setCreateModalOpen(true)
              }}
            >
              <Plus className="size-4 text-zinc-200 dark:text-zinc-800" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="w-10 sm:w-11 md:w-12 h-10 sm:h-11 md:h-12 rounded-2xl border border-border cursor-pointer text-zinc-500 hover:text-zinc-500 dark:text-zinc-400 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-muted transition-all duration-200"
              onClick={() => {
                if (!user) return setLoginModalOpen(true)
                setReelsModalOpen(true)
              }}
            >
              <SquarePlay className="size-4" />
            </Button>

            <ThemeToggle />

            {user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 sm:w-11 md:w-12 h-10 sm:h-11 md:h-12 rounded-2xl border border-border cursor-pointer text-zinc-500 hover:text-zinc-500 dark:text-zinc-400 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-muted transition-all duration-200"
                  >
                    <Avatar className="h-6 w-6 rounded-xl">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                      <AvatarFallback className="rounded-full">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                  <div className="space-y-2">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.user_metadata?.full_name || user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start rounded-xl hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20"
                      onClick={() => signOut()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-xl border border-transparent cursor-pointer text-zinc-500 hover:text-zinc-500 dark:text-zinc-400 bg-zinc-100 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 dark:bg-zinc-800 dark:hover:bg-muted transition-all duration-200"
                onClick={() => setLoginModalOpen(true)}
              >
                <User className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center flex-shrink-0 absolute top-2 right-2 z-50">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-transparent text-zinc-500 hover:text-zinc-500 dark:text-zinc-400 bg-zinc-100 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 dark:bg-zinc-800 transition-all duration-200"
                  onClick={onMobileSidebarToggle}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                sideOffset={8}
                className="w-auto rounded-2xl p-3 bg-zinc-100 dark:bg-zinc-800 flex flex-wrap gap-2 justify-end"
              >
                <Button
                  size="icon"
                  className="w-10 h-10 rounded-xl cursor-pointer dark:bg-zinc-50 dark:text-zinc-900 hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-blue-500/30 shadow-sm transition-all duration-200"
                  onClick={() => (!user ? setLoginModalOpen(true) : setCreateModalOpen(true))}
                >
                  <Plus className="size-4 dark:text-zinc-900" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-xl border border-transparent cursor-pointer text-zinc-500 hover:text-zinc-500 dark:text-zinc-400 bg-zinc-100 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 dark:bg-zinc-800 dark:hover:bg-muted transition-all duration-200"
                  onClick={() => (!user ? setLoginModalOpen(true) : setReelsModalOpen(true))}
                >
                  <SquarePlay className="size-4" />
                </Button>

                <ThemeToggle />

                {user ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-10 h-10 rounded-xl border border-transparent text-zinc-500 hover:text-zinc-500 dark:text-zinc-400 bg-zinc-100 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 dark:bg-zinc-800 dark:hover:bg-muted transition-all duration-200"
                      >
                        <Avatar className="h-6 w-6 rounded-xl">
                          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                          <AvatarFallback className="rounded-full">
                            {user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                      <div className="space-y-2">
                        <div className="px-2 py-1.5">
                          <p className="text-sm font-medium">{user.user_metadata?.full_name || user.email}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start rounded-xl hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20"
                          onClick={() => signOut()}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 rounded-xl border border-transparent text-zinc-500 hover:text-zinc-500 dark:text-zinc-400 bg-zinc-100 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 dark:bg-zinc-800 dark:hover:bg-muted transition-all duration-200"
                    onClick={() => setLoginModalOpen(true)}
                  >
                    <User className="h-4 w-4" />
                  </Button>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Notice Banner */}
        <NoticeBanner
          message="New: Live preview feature 👀 - see your code, edit & see it in action!!"
          variant="info"
        />
      </header>


      <CreatePinModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
      <ReelsModal open={reelsModalOpen} onOpenChange={setReelsModalOpen} />
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </>
  )
}