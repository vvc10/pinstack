"use client"

import Link from "next/link"
import { useState } from "react"
import { 
  Home, 
  Clock, 
  Bookmark,
  LayoutDashboard,
  MoreHorizontal,
  HelpCircle,
  Lightbulb,
  User,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useRef, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
 import { Menu, Plus, SquarePlay, Megaphone } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSidebar } from "@/components/board/boards-sidebar"
import { CreatePinModal } from "@/components/pin/create-pin-modal"
import { ReelsModal } from "@/components/reels/reels-modal"
import { NoticeBanner } from "@/components/ui/notice-banner"
import { LoginModal } from "@/components/auth/login-modal"
import { useAuth } from "@/contexts/auth-context"
import { useLoadingState } from "@/hooks/use-loading"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SearchBoxBar } from "@/components/search-bar-box"


interface MobileBottomNavProps {
  currentTab?: string
}


export function MobileBottomNav({ currentTab = "home" }: MobileBottomNavProps) {
  const [moreOpen, setMoreOpen] = useState(false)
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


  const navItems = [
    {
      href: "/home",
      icon: Home,
      label: "Home",
      tab: "home"
    },
    {
      href: "/recent", 
      icon: Clock,
      label: "Recent",
      tab: "recent"
    },
    {
      href: "/yourpins",
      icon: Bookmark,
      label: "Your Pins", 
      tab: "yourpins"
    },
    {
      href: "/boards",
      icon: LayoutDashboard,
      label: "Boards",
      tab: "boards"
    }
  ]

  const handleHelpClick = () => {
    window.open("https://x.com/pankajstwt", "_blank", "noopener,noreferrer")
    setMoreOpen(false)
  }

  const handleSuggestionClick = () => {
    // This will be handled by the parent component or context
    // For now, we'll just close the popover
    setMoreOpen(false)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-[9999] md:hidden rounded-tr-3xl rounded-tl-3xl">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentTab === item.tab
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
        
        {/* More Button */}
        <Popover open={moreOpen} onOpenChange={setMoreOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors text-muted-foreground hover:bg-muted"
            >
              <MoreHorizontal className="h-5 w-5 flex-shrink-0" />
              <span className="text-xs font-medium">More</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 rounded-2xl mb-2" align="center">
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start rounded-xl"
                onClick={handleHelpClick}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Help Center
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start rounded-xl"
                onClick={handleSuggestionClick}
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                Suggestion
              </Button>
              
<div className="mx-atuo w-fit">
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
                          className="w-10 h-10 rounded-xl border border-transparent text-zinc-500 hover:text-zinc-500 dark:text-zinc-400 bg-zinc-100 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 dark:bg-zinc-800 dark:hover:bg-muted transition-all duration-200"
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
</div>
              
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
