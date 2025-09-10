"use client"

import { useEffect, useMemo, useState, use } from "react"
import Link from "next/link"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { AppLayout } from "@/components/layout/app-layout"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { Share2, Users, Lock, Unlock } from "lucide-react"

type BoardResp = {
  board: {
    id: string
    name: string
    description?: string
    is_public: boolean
    owner: {
      id: string
      username: string
      full_name?: string
      avatar_url?: string
    }
    pins: Array<{
      id: string
      title: string
      image: string
      tags: string[]
      lang: string
      height: number
      code: string
      created_at: string
      author?: {
        id: string
        username: string
        avatar_url?: string
      }
    }>
    isCollaborator: boolean
    canEdit: boolean
  }
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function SharedBoardPageContent({ params }: { params: Promise<{ token: string }> }) {
  const { token: boardId } = use(params) // Using boardId instead of token
  const { user } = useAuth()
  const [joining, setJoining] = useState(false)
  
  const { data, error, mutate } = useSWR<BoardResp>(`/api/boards/${boardId}/share`, fetcher)

  const handleJoinBoard = async () => {
    if (!user) {
      toast.error("Please sign in to join this board")
      return
    }

    setJoining(true)
    try {
      const response = await fetch(`/api/boards/${boardId}/share`, {
        method: "POST",
        headers: { "content-type": "application/json" }
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to join board')
      }

      toast.success("🎉 Success!", {
        description: result.message || "Successfully joined the board!",
        duration: 4000,
      })

      // Refresh the board data
      mutate()
    } catch (error: any) {
      console.error('Error joining board:', error)
      toast.error("❌ Failed to Join Board", {
        description: error.message || "Something went wrong. Please try again.",
        duration: 4000,
      })
    } finally {
      setJoining(false)
    }
  }

  if (error) {
    return (
      <AppLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-2">Board Not Found</h1>
            <p className="text-muted-foreground mb-4">
              This board doesn't exist or the share link is invalid.
            </p>
            <Button asChild>
              <Link href="/boards">Go to Your Boards</Link>
            </Button>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!data) {
    return (
      <AppLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading board...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  const { board } = data || {}
  const pins = board?.pins || []

  return (
    <AppLayout>
      <div>
        {/* Board Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{board?.name || 'Board'}</h1>
                {board?.is_public ? (
                  <Unlock className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              {board?.description && (
                <p className="text-muted-foreground mb-3">{board?.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>by {board?.owner?.full_name || board?.owner?.username || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 className="h-4 w-4" />
                  <span>Shared board</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {!user ? (
                <Button asChild>
                  <Link href="/sign-in">Sign in to Join</Link>
                </Button>
              ) : board?.isCollaborator ? (
                <Button asChild>
                  <Link href={`/boards/${board?.id}`}>View Board</Link>
                </Button>
              ) : (
                <Button 
                  onClick={handleJoinBoard}
                  disabled={joining}
                  className="bg-primary hover:bg-primary/90"
                >
                  {joining ? "Joining..." : "Join Board"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Board Content */}
        {pins.length === 0 ? (
          <div className="rounded-md border bg-card text-card-foreground p-8 text-center">
            <p className="text-muted-foreground">This board is empty.</p>
            {board?.canEdit && (
              <p className="text-sm text-muted-foreground mt-2">
                Start adding pins to this board!
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {pins.map((pin) => (
              <article
                key={pin.id}
                className="overflow-hidden rounded-md border bg-card text-card-foreground shadow-sm transition hover:shadow"
              >
                <img
                  src={pin.image || "/placeholder.svg"}
                  alt={`Preview for ${pin.title}`}
                  className="w-full object-cover"
                  style={{ height: 180 }}
                />
                <div className="p-3">
                  <h3 className="text-sm font-medium leading-snug line-clamp-2 mb-2">
                    {pin.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {pin.lang}
                    </span>
                    {pin.author && (
                      <span className="text-[11px] text-muted-foreground">
                        by {pin.author.username}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default function SharedBoardPage({ params }: { params: Promise<{ token: string }> }) {
  return <SharedBoardPageContent params={params} />
}
