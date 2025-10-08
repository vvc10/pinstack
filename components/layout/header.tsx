"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { User, Plus, LogOut, SquarePlay, Github } from "lucide-react"
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
import { FiltersBar } from "@/components/filters-bar"
import Link from "next/link"

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
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Handle case where searchParams might not be available during SSR
  const safeSearchParams = searchParams || new URLSearchParams()

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 200 // Reduced threshold for quicker response
      setIsScrolled(window.scrollY > scrollThreshold)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const urlParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "")
    const tagsParam = urlParams.get("category")
    setSelectedTags(tagsParam ? tagsParam.split(",").filter(Boolean) : [])
  }, [pathname, searchParams])

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]

    setSelectedTags(newTags)

    const params = new URLSearchParams(safeSearchParams.toString())
    if (newTags.length > 0) {
      params.set("category", newTags.join(","))
    } else {
      params.delete("category")
    }
    router.push(`/home?${params.toString()}`)
  }

  const handleClearAll = () => {
    setSelectedTags([])
    const params = new URLSearchParams(safeSearchParams.toString())
    params.delete("category")
    params.delete("q")
    router.push(`/home?${params.toString()}`)
  }

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
        className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 transition-all duration-300 ease-in-out ${isCollapsed ? "md:left-16" : "md:left-64"
          } ${isScrolled
            ? "bg-zinc-100/20 dark:bg-zinc-800/20 m-0 p-0 backdrop-blur-lg rounded-br-3xl rounded-bl-3xl"
            : "bg-zinc-300/30 dark:bg-black m-2 sm:m-3 md:m-4 rounded-3xl"
          } backdrop-blur-md`}
   
      >
        
        <div
          className={`container mx-auto transition-all duration-300 ease-in-out flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-3 md:gap-4 max-w-full px-2 sm:px-3 md:px-4 ${isScrolled ? "py-2 sm:py-2.5 bg-background/70 backdrop-blur-md" : "py-3 sm:py-4"
            }`}
        >

          {/* brand logo for mobile */}
          <div className="absolute md:hidden z-[500] lg:hidden top-2 left-2 h-10 w-10 font-garamond rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-xl">Ps.</span>
          </div>

          {/* Search Section */}
          <div className={`flex-1 ${isScrolled ? "" : "pt-15 md:pt-20"} md:px-4 md:pb-4`}>
            <h2
              className={`text-3xl text-center sm:text-4xl md:text-5xl font-semibold font-poppins tracking-tight mb-3 ${isScrolled ? "hidden" : "block"
                }`}
            >
              Beautiful UI Components, <span className="  px-3 py-1 rounded-2xl bg-primary/0">Ready to Copy.</span>
            </h2>
            <p
              className={`text-zinc-600 dark:text-zinc-300 text-center w-[90%] md:w-[60%] mx-auto text-xs sm:text-base md:text-lg leading-relaxed ${isScrolled ? "hidden" : "block"
                }`}
            >
              A premium collection of stunning, accessible, and fully customizable UI components — designed to help you
              build visually exceptional and high-performing web experiences effortlessly.
            </p>

            {/* search bar */}
            <SearchBoxBar sort={sort} onSortChange={onSortChange} isScrolled={isScrolled} />

            <div className={`z-50 transition-all ${isScrolled ? "block" : "block"}`}>
              <div className={`${isScrolled ? "mx-0" : "mx-auto"}  w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[70%]`}>
                <div className={`${isScrolled ? "mt-12" : "mt-2"} pt-2`}>
                  <FiltersBar selectedTags={selectedTags} onTagToggle={handleTagToggle} onClearAll={handleClearAll} />
                </div>
              </div>
            </div>

            {/* social proof */}
            <p
              className={`text-zinc-600 items-center dark:text-zinc-400 text-[14px] w-fit mx-auto sm:text-base md:text-lg leading-relaxed transition-all border-t border-border mt-3 pt-3 duration-300 ${isScrolled ? "hidden" : "block"
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
                  <span className="text-xs sm:text-base italic h-fit mx-auto w-fit my-auto text-zinc-700 dark:text-zinc-300 font-normal">
                    110+ creatives on it!
                  </span>
                </div>
              )}
            </p>
          </div>

          {/* Desktop Action Buttons */}
          <div
            className={`hidden md:flex z-50 items-center gap-2 sm:gap-3 flex-shrink-0 transition-all duration-300 ${isScrolled ? "absolute top-2 right-2" : "absolute right-4 sm:right-6 top-3 sm:top-4"
              }`}
          >
            <Link href="https://github.com/vvc10/pinstack">
              <Button
                variant="ghost"
                size="icon"
                className={`${isScrolled? "w-10 sm:w-11 md:w-12 h-10 sm:h-11 md:h-12":" h-10 sm:h-11 md:h-12 w-fit sm:w-fit md:w-fit"} px-3 rounded-2xl border border-border cursor-pointer text-zinc-200 dark:text-zinc-200 bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-950 dark:hover:bg-zinc-900/50 transition-all duration-200`}

              >
               <p className={`${isScrolled? "hidden":"block"}`}> Star on</p>
                <Github className="size-4" />
              </Button>
            </Link>
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
                      <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} alt={user.email} />
                      <AvatarFallback className="rounded-full">{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
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
                className="w-10 sm:w-11 md:w-12 h-10 sm:h-11 md:h-12 rounded-2xl border border-border cursor-pointer text-zinc-500 hover:text-zinc-500 dark:text-zinc-400 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-muted transition-all duration-200"
                onClick={() => setLoginModalOpen(true)}
              >
                <User className="h-4 w-4" />
              </Button>
            )}



          </div>
        </div>

        {/* Notice Banner */}
        <NoticeBanner
          message="New: Live preview feature 👀 - see your code, edit & see it in action!!"
          variant="info"
        />
      </header>

      {/* Mobile Menu */}
      <div className="md:hidden bottom  flex items-center flex-shrink-0 fixed bottom-[100px] right-[30px] z-50">
        <Button
          size="icon"
          className="w-10 h-10 rounded-xl cursor-pointer dark:bg-zinc-50 dark:text-zinc-900 hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-blue-500/30 shadow-sm transition-all duration-200"
          onClick={() => (!user ? setLoginModalOpen(true) : setCreateModalOpen(true))}
        >
          <Plus className="size-4 dark:texst-zinc-900" />
        </Button>
      </div>
      <CreatePinModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
      <ReelsModal open={reelsModalOpen} onOpenChange={setReelsModalOpen} />
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </>
  )
}
