"use client"

import { useMemo, useState, useCallback, useEffect } from "react"
import useSWR from "swr"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bookmark, ExternalLink, Heart, PlayCircle, MoreHorizontal, Share2, Edit, Copy, Check, Code, Clock, CheckCircle, XCircle, Play } from "lucide-react"
import { SelectBoardDialog } from "@/components/board/select-board-dialog"
import { VideoLightbox } from "@/components/reels/video-lightbox"
import { ShareMenu } from "@/components/pin/share-menu"
import { EditPinModal } from "@/components/pin/edit-pin-modal"
import { PlaygroundModal } from "@/components/playground/playground-modal"
import type { Pin } from "../../types/pin"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { useResponsive } from "@/hooks/use-responsive"
import { useRealtimeVotes } from "@/hooks/use-realtime-votes"
import { useSavedPins } from "@/hooks/use-saved-pins"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const LANG_HOVER_SHADOW: Record<string, string> = {
  javascript: "hover:shadow-[0_0_0_2px_rgba(241,224,90,0.7)]",
  typescript: "hover:shadow-[0_0_0_2px_rgba(56,189,248,0.7)]",
  python: "hover:shadow-[0_0_0_2px_rgba(37,99,235,0.7)]",
  css: "hover:shadow-[0_0_0_2px_rgba(99,102,241,0.7)]",
  go: "hover:shadow-[0_0_0_2px_rgba(14,165,233,0.7)]",
  rust: "hover:shadow-[0_0_0_2px_rgba(251,113,133,0.7)]",
  sql: "hover:shadow-[0_0_0_2px_rgba(139,92,246,0.7)]",
}

export function PinCard({ 
  pin, 
  onTagClick, 
  onLangClick, 
  isInBoard = false, 
  onRemoveFromBoard 
}: { 
  pin: Pin; 
  onTagClick?: (tag: string) => void; 
  onLangClick?: (lang: string) => void;
  isInBoard?: boolean;
  onRemoveFromBoard?: () => void;
}) {
  const [saveOpen, setSaveOpen] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [playgroundOpen, setPlaygroundOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  const { user } = useAuth()
  
  // Get responsive info for layout
  const { breakpoint, columns } = useResponsive()
  
  // Real-time votes
  const { voteCount: realtimeVoteCount, isLiked, isConnected, currentUserId, broadcastVote } = useRealtimeVotes(pin.id)
  
  // Saved pins hook
  const { isPinSaved, addToSaved, removeFromSaved } = useSavedPins()
  const isSaved = isPinSaved(pin.id)
  


  useEffect(() => {
    setMounted(true)
  }, [])

  // Debug edit modal state changes
  useEffect(() => {
    console.log('🔄 Edit modal state changed to:', editOpen)
  }, [editOpen])

  // No need for dynamic height calculation - images will show their natural dimensions

  const hoverShadow = useMemo(
    () => LANG_HOVER_SHADOW[pin.lang] || "hover:shadow-[0_0_0_2px_rgba(139,92,246,0.6)]",
    [pin.lang],
  )

  // Status indicator component
  const StatusIndicator = ({ status }: { status?: string }) => {
    if (!status || status === 'published') return null
    
    const statusConfig = {
      pending: {
        icon: Clock,
        text: 'Pending Review',
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
        iconClassName: 'text-yellow-600 dark:text-yellow-400'
      },
      archived: {
        icon: XCircle,
        text: 'Archived',
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        iconClassName: 'text-gray-600 dark:text-gray-400'
      },
      draft: {
        icon: Edit,
        text: 'Draft',
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
        iconClassName: 'text-blue-600 dark:text-blue-400'
      }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) return null
    
    const Icon = config.icon
    
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        <Icon className={`h-3 w-3 ${config.iconClassName}`} />
        <span>{config.text}</span>
      </div>
    )
  }

  // Use real-time data from the hook - no count needed on pin cards

  const { data: badgesData } = useSWR<{ pinId: string; badges: string[] }>(
    `/api/badges?pinId=${pin.id}&lang=${encodeURIComponent(pin.lang)}&tags=${encodeURIComponent(pin.tags.join(","))}`,
    fetcher,
    { fallbackData: { pinId: pin.id, badges: pin.badges ?? [] } },
  )

  const router = useRouter()

  const openWithUrl = useCallback(() => {
    router.push(`/pin/${pin.id}`)
  }, [router, pin.id])

  const handleLike = useCallback(async () => {
    if (!currentUserId) {
      console.log('❌ No currentUserId, cannot like')
      return
    }
    
    console.log('🔄 Pin card like clicked:', { 
      pinId: pin.id, 
      currentIsLiked: isLiked, 
      currentUserId 
    })
    
    // Optimistic update - immediately show the new state
    const newIsLiked = !isLiked
    
    console.log('🔄 Optimistic update:', { newIsLiked })
    
    // Broadcast optimistic update immediately (count will be handled by API)
    broadcastVote(0, newIsLiked, newIsLiked ? 'like' : 'unlike')
    
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinId: pin.id, userId: currentUserId })
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ API response:', data)
        // Broadcast the actual data from the database to sync with reality
        broadcastVote(data.count, data.isLiked, data.isLiked ? 'like' : 'unlike')
        
        // Show toast notification
        if (data.isLiked) {
          toast.success("❤️ Liked!", {
            description: `Added "${pin.title}" to your liked pins`,
            duration: 3000,
          })
        } else {
          toast.success("💔 Unliked", {
            description: `Removed "${pin.title}" from your liked pins`,
            duration: 3000,
          })
        }
        } else {
        console.error('Failed to toggle vote')
        // Revert optimistic update on error
        broadcastVote(0, isLiked, isLiked ? 'like' : 'unlike')
        toast.error("❌ Failed to Like", {
          description: "Something went wrong. Please try again.",
            duration: 3000,
          })
      }
    } catch (error) {
      console.error('Error toggling vote:', error)
      // Revert optimistic update on error
      broadcastVote(0, isLiked, isLiked ? 'like' : 'unlike')
      toast.error("❌ Failed to Like", {
        description: "Something went wrong. Please try again.",
        duration: 3000,
      })
    }
  }, [pin.id, pin.title, currentUserId, isLiked, broadcastVote])

  const handleShare = useCallback(() => {
    setShareOpen(true)
  }, [])

  return (
    <>
      <article
        className={`group relative overflow-hidden rounded-2xl bg-card text-card-foreground shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${hoverShadow}`}
        style={{
          // Add a subtle border for better definition
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Image Container */}
        <button
          type="button"
          className="relative block w-full text-left"
          onClick={openWithUrl}
          aria-label={`Open ${pin.title}`}
        >
          <img
            src={pin.image || "/placeholder.svg"}
            alt={`Preview for ${pin.title} in ${pin.lang}`}
            className="w-full h-auto"
            style={{ 
              // Remove fixed height to let image show its natural dimensions
              // The image will maintain its aspect ratio
            }}
          />
          
          {/* Video Play Button Overlay */}
          {pin.videoUrl ? (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation()
                setVideoOpen(true)
              }}
              aria-label="Play video"
            >
              <PlayCircle className="h-12 w-12 text-white/90 drop-shadow-lg" />
            </div>
          ) : null}
 
        

          {/* Top Right Action Buttons - Visible on Hover */}
          <div 
            className="absolute top-3 right-3 flex flex-row gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none"
          >
            {/* Playground Button */}
            {/* <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full bg-white/0 hover:bg-white/0 z-20 cursor-pointer hover:scale-110 transition-all duration-200 pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation()
                setPlaygroundOpen(true)
              }}
              aria-label="Open playground"
            >
              <Play className="h-5 w-5 text-white" />
            </Button> */}

            {/* Edit Button - Only show for pin owner */}
            {user && pin.author_id === user.id && (
              <button
                className="h-10 w-10 rounded-full bg-white/0 hover:bg-white/0 z-20 flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-200 pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  console.log('✅ Edit button clicked - Opening edit modal for pin:', pin.id)
                  console.log('User ID:', user.id, 'Pin Author ID:', pin.author_id)
                  console.log('Current editOpen state:', editOpen)
                  setEditOpen(true)
                  console.log('Called setEditOpen(true)')
                }}
                aria-label="Edit pin"
              >
                <Edit className="h-5 w-5 text-white" />
              </button>
            )}
            
            {/* Like Button */}
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full bg-white/0 hover:bg-white/0 z-20 cursor-pointer hover:scale-110 transition-all duration-200 pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation()
                console.log('✅ Like button clicked for pin:', pin.id)
                handleLike()
              }}
              aria-label="Like"
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
            </Button>

            {/* Share Button */}
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full bg-white/0 hover:bg-white/0 z-20 cursor-pointer hover:scale-110 transition-all duration-200 pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation()
                handleShare()
              }}
              aria-label="Share"
            >
              <Share2 className="h-5 w-5 text-white" />
            </Button>
          </div>

          {/* Center Copy Button - Visible on Hover */}
          <div 
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none"
          >
            <Button
              size="icon"
              variant="secondary"
              className={`h-fit w-fit px-2 py-2 rounded-xl shadow-lg backdrop-blur-sm z-20 transition-all duration-200 cursor-pointer hover:scale-110 pointer-events-auto dark:bg-zinc-200 ${
                copied 
                  ? 'bg-green-500/90 hover:bg-green-500 text-white' 
                  : 'bg-card/90 hover:bg-card'
              }`}
              onClick={(e) => {
                e.stopPropagation()
                navigator.clipboard.writeText(pin.code)
                setCopied(true)
                toast.success("📋 Code Copied!", {
                  description: `"${pin.title}" code has been copied to clipboard`,
                  duration: 3000,
                })
                // Reset the copied state after 2 seconds
                setTimeout(() => {
                  setCopied(false)
                }, 2000)
              }}
              aria-label={copied ? "Copied!" : "Copy code"}
            >
              {copied ? (
                <div className="flex items-center gap-1 dark:text-zinc-800">
                  <Check className="h-4 w-4" />
                  <span className="text-xs font-medium">Copied</span>
                </div>
                              ) : (
                  <div className="flex items-center gap-2 dark:text-zinc-800">
                    <Code className="h-4 w-4" />
                    <span className="text-xs font-medium">Copy</span>
                  </div>
                )}
            </Button>
          </div>
        </button>

        {/* Save/Remove Button - Only show on hover */}
        <div 
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none"
        >
            <Button
              size="sm"
            className={`h-9 px-4 rounded-2xl shadow-lg font-medium flex-shrink-0 z-20 cursor-pointer hover:scale-105 transition-all duration-200 pointer-events-auto ${
              isInBoard 
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" 
                : isSaved
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
              onClick={async (e) => {
                e.stopPropagation()
                if (isInBoard && onRemoveFromBoard) {
                  onRemoveFromBoard()
                } else if (isSaved) {
                  // Remove from saved pins (both general and board-specific)
                  try {
                    const response = await fetch(`/api/pins/${pin.id}/save`, {
                      method: 'DELETE'
                    })
                    
                    if (response.ok) {
                      removeFromSaved(pin.id)
                      toast.success("📌 Removed from saved", {
                        description: `"${pin.title}" has been removed from your saved pins`,
                        duration: 3000,
                      })
                    }
                  } catch (error) {
                    console.error('Failed to remove saved pin:', error)
                    toast.error("❌ Failed to remove", {
                      description: "Something went wrong. Please try again.",
                      duration: 3000,
                    })
                  }
                } else {
                  // Save to general collection first, then show board selection
                  try {
                    const response = await fetch('/api/pins/save', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ pinId: pin.id })
                    })
                    
                    if (response.ok) {
                      addToSaved(pin.id)
                      toast.success("📌 Saved!", {
                        description: `"${pin.title}" has been saved to your collection`,
                        duration: 3000,
                      })
                    } else {
                      // If general save fails, show board selection
                      setSaveOpen(true)
                    }
                  } catch (error) {
                    console.error('Failed to save pin:', error)
                    // If general save fails, show board selection
                    setSaveOpen(true)
                  }
                }
              }}
              aria-label={isInBoard ? "Remove" : isSaved ? "Remove from saved" : "Save"}
            >
              {isInBoard ? "Remove" : isSaved ? "Saved" : "Save"}
            </Button>
        </div>
      </article>

      {/* Title and Status - Always visible below image */}
      <div className="p-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="text-sm font-medium leading-snug text-card-foreground truncate flex-1" title={pin.title}>
            {pin.title}
          </h3>
          <StatusIndicator status={pin.status} />
        </div>
      </div>

      <SelectBoardDialog open={saveOpen} onOpenChange={setSaveOpen} pin={pin} />
      {pin.videoUrl ? (
        <VideoLightbox open={videoOpen} onOpenChange={setVideoOpen} title={pin.title} videoUrl={pin.videoUrl} />
      ) : null}
      <EditPinModal open={editOpen} onOpenChange={setEditOpen} pin={pin} />
      <PlaygroundModal open={playgroundOpen} onOpenChange={setPlaygroundOpen} pin={pin} />
      <ShareMenu 
        open={shareOpen} 
        onOpenChange={setShareOpen}
        url={`${typeof window !== 'undefined' ? window.location.origin : ''}/pin/${pin.id}`}
        title={pin.title}
      />

    </>
  )
}
