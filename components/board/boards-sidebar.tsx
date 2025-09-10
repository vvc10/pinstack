"use client"

import Link from "next/link"
import useSWR from "swr"
import { useState, createContext, useContext, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { 
  Home, 
  Clock, 
  Users, 
  MessageCircle, 
  Bell, 
  Rocket, 
  Settings, 
  BarChart3, 
  ChevronRight,
  Plus,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Book,
  LayoutDashboard,
  Bookmark,
  SquarePlay
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type BoardsResp = { boards: { id: string; name: string; count: number }[] }

// Sidebar Context
interface SidebarContextType {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  
  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function BoardsSidebar({ 
  isMobileOpen, 
  onMobileClose,
  currentTab = "home"
}: { 
  isMobileOpen?: boolean; 
  onMobileClose?: () => void; 
  currentTab?: string;
}) {
  const [mounted, setMounted] = useState(false)
  const { data, mutate } = useSWR<BoardsResp>(mounted ? "/api/boards" : null, fetcher)
  const boards = data?.boards || []
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [boardsExpanded, setBoardsExpanded] = useState(false)
  const { isCollapsed, setIsCollapsed } = useSidebar()

  useEffect(() => {
    setMounted(true)
  }, [])

  async function createBoard() {
    if (!name.trim()) return
    setLoading(true)
    const res = await fetch("/api/boards", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name }),
    })
    setLoading(false)
    if (!res.ok) {
      toast({ title: "Failed to create board", description: "Please try again.", variant: "destructive" })
      return
    }
    setName("")
    mutate()
  }

  const sidebarContent = (
    <aside aria-label="Sidebar" className={`h-full transition-all duration-300 z-[9999] ease-in-out ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Collapse Toggle Button */}
      <div className="absolute -right-3 top-6 z-[9999]">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-6 w-6 p-0 rounded-full shadow-md border-2 border-background"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>

      <div className={`h-full overflow-hidden transition-all duration-300 ease-in-out flex flex-col ${
        isCollapsed ? 'px-2' : 'px-4'
      }`}>
        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Branding Section */}
          <div className={`flex items-center gap-3 py-4 ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-sm">P.</span>
            </div>
            {!isCollapsed && (
              <span className="font-bold text-xl truncate">P.</span>
            )}
          </div>

          {/* Main Navigation */}
          <nav className="space-y-1">
          <Link
            href="/home"
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
              currentTab === "home" 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-muted'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <Home className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Home</span>}
          </Link>
          <Link
            href="/recent"
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
              currentTab === "recent" 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-muted'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <Clock className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Recent</span>}
          </Link>
          {/* Will implement later */}
          {/* <Link
            href="/following"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              currentTab === "following" 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-muted'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <Users className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Following</span>}
          </Link> */}
          <Link
            href="/learnings"
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
              currentTab === "learnings" 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-muted'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <BookOpen className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Learnings</span>}
          </Link>

          <Link
            href="/reels"
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
              currentTab === "reels" 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-muted'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <SquarePlay className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Reels</span>}
          </Link>

          <Link
            href="/yourpins"
            className={`flex items-center gap-3 px-3 py-3 rounded-xl   transition-colors ${
              currentTab === "yourpins" 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-muted'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <Bookmark className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Your Pins</span>}
          </Link>

          <Link
                href="/boards"
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl  transition-colors ${
              currentTab === "boards" 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-muted'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Boards</span>}
          </Link>
        </nav>


 

        {/* Insights Section */}
        {/* {!isCollapsed && (
          <div className="space-y-1 mt-6">
            <h3 className="text-sm font-medium text-muted-foreground px-3">Insights</h3>
            <Link
              href="/messages"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentTab === "messages" 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              <span>Messages</span>
            </Link>
            <Link
              href="/notifications"
              className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                currentTab === "notifications" 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </div>
              <div className="h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center">
                <span className="text-white text-xs font-medium">2</span>
              </div>
            </Link>
          </div>
        )}
  */}

          {/* User Profile Card */}
          {/* {!isCollapsed && (
            <div className="bg-card border rounded-xl p-4 mx-3 mt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground font-medium">U</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">User Name</p>
                  <p className="text-xs text-muted-foreground">Last Login: Today</p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )} */}
        </div>

        {/* Promotional Section - Stuck to bottom */}
        {!isCollapsed && (
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-xl p-4 mx-3 mt-4 mb-4 flex-shrink-0">
            <div className="text-center space-y-3">
              <div className="relative w-16 h-16 mx-auto">
              
              </div>
              <div className="space-y-2">
                <Link 
                  href="/business-tools" 
                  className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                >
                  Unlock Business Tools
                </Link>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Hurry Up! Now you can unlock our new business tools at your convenience.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )

  // If mobile props are provided, render as mobile overlay
  if (isMobileOpen !== undefined && onMobileClose) {
    return (
      <>
        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div className="fixed inset-0 bg-background/50 z-[9998] md:hidden" onClick={onMobileClose} />
        )}
        
        {/* Mobile Sidebar */}
        <div className={`fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-background border-r z-[9999] transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">P.</span>
                </div>
                <span className="font-bold text-xl">Pinstack</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onMobileClose}
                className="h-8 w-8 p-0"
              >
                <span className="text-2xl">×</span>
              </Button>
            </div>
            {sidebarContent}
          </div>
        </div>
      </>
    )
  }

  // Desktop sidebar - Fixed positioning
  return (
    <div className="fixed left-0 top-0 h-full bg-background border-r z-[9999]">
      {sidebarContent}
    </div>
  )
}
