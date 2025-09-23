"use client"

import Link from "next/link"
import useSWR from "swr"
import { useState, createContext, useContext, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
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
  
  // Suggestion modal state
  const [showSuggestionModal, setShowSuggestionModal] = useState(false)
  const [suggestionType, setSuggestionType] = useState("suggestion")
  const [suggestionDescription, setSuggestionDescription] = useState("")
  const [submittingSuggestion, setSubmittingSuggestion] = useState(false)

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
      toast.error("Failed to create board", { description: "Please try again." })
      return
    }
    setName("")
    mutate()
  }

  function openSuggestionModal() {
    setSuggestionType("suggestion")
    setSuggestionDescription("")
    setShowSuggestionModal(true)
  }

  async function submitSuggestion() {
    if (!suggestionType || !suggestionDescription.trim()) {
      toast.error("Please fill all fields", { description: "Select a type and provide a description." })
      return
    }
    
    setSubmittingSuggestion(true)
    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: suggestionType,
          description: suggestionDescription.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to submit suggestion")
      }

      const result = await response.json()
      
      toast.success("Suggestion submitted!", { 
        description: "Thank you for your feedback. We'll review it soon." 
      })
      
      setSuggestionType("")
      setSuggestionDescription("")
      setShowSuggestionModal(false)
    } catch (error) {
      console.error("Error submitting suggestion:", error)
      toast.error("Failed to submit suggestion", { 
        description: error instanceof Error ? error.message : "Please try again later." 
      })
    } finally {
      setSubmittingSuggestion(false)
    }
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
              <span className="text-primary-foreground font-bold text-sm">Ps.</span>
            </div>
            {!isCollapsed && (
              <span className="font-bold text-xl truncate">Pinstack</span>
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
{/*           
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
          </Link> */}

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
        {!isCollapsed ? (
          <>
            <div className="bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-900/50 dark:to-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 rounded-lg p-3 mx-3 mt-4 mb-2 flex-shrink-0 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-zinc-600 to-zinc-700 dark:from-zinc-500 dark:to-zinc-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                <Link 
                  href="https://x.com/pankajstwt" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors duration-200"
                >
                  Help Center
                </Link>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                    Get support & guides
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-900/50 dark:to-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 rounded-lg p-3 mx-3 mb-4 flex-shrink-0 hover:shadow-md transition-all duration-200 cursor-pointer" onClick={openSuggestionModal}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-zinc-600 to-zinc-700 dark:from-zinc-500 dark:to-zinc-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-zinc-700 dark:text-zinc-300 text-sm font-medium">
                    Suggestion
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                    Share ideas & feedback
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Collapsed state - show only icons
          <div className="flex flex-col gap-2 px-2 mt-4 mb-4">
            <Link 
              href="https://x.com/pankajstwt" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border border-zinc-200 dark:border-zinc-700 rounded-lg flex items-center justify-center hover:shadow-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-200 group"
              title="Help Center"
            >
              <svg className="w-4 h-4 text-zinc-600 dark:text-zinc-400 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
            
            <button 
              onClick={openSuggestionModal}
              className="w-10 h-10 border border-zinc-200 dark:border-zinc-700 rounded-lg flex items-center justify-center hover:shadow-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-200 group"
              title="Share Suggestion"
            >
              <svg className="w-4 h-4 text-zinc-600 dark:text-zinc-400 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </button>
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
                  <span className="text-primary-foreground font-bold text-lg">Ps.</span>
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
      <>
        <div className="fixed left-0 top-0 h-full bg-background border-r z-[9999]">
          {sidebarContent}
        </div>
        
        {/* Suggestion Modal */}
        <Dialog open={showSuggestionModal} onOpenChange={setShowSuggestionModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Your Feedback</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="suggestion-type">Type</Label>
                <Select value={suggestionType} onValueChange={setSuggestionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feature-request">Feature Request</SelectItem>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="suggestion-description">Description</Label>
                <Textarea
                  id="suggestion-description"
                  placeholder="Describe your idea or feedback..."
                  value={suggestionDescription}
                  onChange={(e) => setSuggestionDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSuggestionModal(false)}
                  disabled={submittingSuggestion}
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitSuggestion}
                  disabled={submittingSuggestion || !suggestionType || !suggestionDescription.trim()}
                >
                  {submittingSuggestion ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
}
