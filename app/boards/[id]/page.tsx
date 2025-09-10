"use client"

import { useEffect, useMemo, useState, use } from "react"
import Link from "next/link"
import useSWR from "swr"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"
import { Button } from "@/components/ui/button"
import { AppLayout } from "@/components/layout/app-layout"
import { BoardCollaboratorsModal } from "@/components/board/board-collaborators-modal"
import { BoardShareModal } from "@/components/board/board-share-modal"
import { EditBoardModal } from "@/components/board/edit-board-modal"
import { PinCard } from "@/components/pin/pin-card"
import { Masonry } from "@/components/masonry"
import { Users, Share2, ArrowLeft, Edit3 } from "lucide-react"


type BoardResp = {
  board: {
    id: string
    name: string
    description?: string
    is_public: boolean
    collaboratorCount: number
    pins: {
      id: string
      title: string
      image: string
      lang: string
      tags: string[]
      height: number
      code: string
    }[]
  }
  userRole: {
    isOwner: boolean
    isCollaborator: boolean
    collaborationRole: string | null
    canEdit: boolean
    canManageCollaborators: boolean
  }
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function BoardDetailPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, mutate } = useSWR<BoardResp>(`/api/boards/${id}`, fetcher)
  const [saving, setSaving] = useState(false)
  const [collaboratorsModalOpen, setCollaboratorsModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [editBoardModalOpen, setEditBoardModalOpen] = useState(false)

  const pins = useMemo(() => data?.board?.pins || [], [data])

  useEffect(() => {
    // revalidate if page regains focus to reflect saves from elsewhere
    const handler = () => mutate()
    window.addEventListener("focus", handler)
    return () => window.removeEventListener("focus", handler)
  }, [mutate])

  async function onDragEnd(result: DropResult) {
    if (!result.destination) return
    const srcIdx = result.source.index
    const destIdx = result.destination.index
    if (srcIdx === destIdx) return
    const next = [...pins]
    const [moved] = next.splice(srcIdx, 1)
    next.splice(destIdx, 0, moved)
    // optimistic update
    mutate({ 
      board: { ...data!.board, pins: next },
      userRole: data!.userRole
    }, { revalidate: false })
    setSaving(true)
    await fetch(`/api/boards/${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ order: next.map((p) => p.id) }),
    })
    setSaving(false)
    mutate()
  }

  async function remove(pinId: string) {
    // optimistic update
    const next = pins.filter((p) => p.id !== pinId)
    mutate({ 
      board: { ...data!.board, pins: next },
      userRole: data!.userRole
    }, { revalidate: false })
    
    try {
      const response = await fetch(`/api/boards/${id}`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pinId }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to remove pin')
      }
      
      mutate()
    } catch (error) {
      console.error('Error removing pin:', error)
      // Revert optimistic update on error
      mutate()
    }
  }

  return (
    <AppLayout currentTab="boards">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="p-2 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
              <Link href="/boards">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-balance">
                {data?.board?.name || `Board: ${id}`}
              </h1>
              {data?.board?.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {data.board.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {data?.userRole?.canManageCollaborators && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCollaboratorsModalOpen(true)}
                className="h-10 w-10 rounded-xl cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-muted/60 transition-colors duration-200"
                title="Manage Collaborators"
              >
                <Users className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShareModalOpen(true)}
              className="h-10 w-10 rounded-xl cursor-pointer hover:bg-muted/80 hover:text-zinc-700 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-muted/60 transition-colors duration-200"
              title="Share Board"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            {data?.userRole?.canEdit && (
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => setEditBoardModalOpen(true)}
                className="h-10 w-10 rounded-xl cursor-pointer hover:bg-muted/80 hover:text-zinc-700 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-muted/60 transition-colors duration-200"
                title={saving ? "Saving..." : "Edit Board"}
                disabled={saving}
              >
                {saving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Edit3 className="h-4 w-4" />
                )}
              </Button>
            )}
            {data?.userRole?.isCollaborator && (
              <div className="text-xs text-muted-foreground px-3 py-1.5 bg-muted/50 rounded-full border">
                {data.userRole.collaborationRole === 'editor' ? 'Editor' : 'Viewer'}
              </div>
            )}
          </div>
        </div>

        {!data && <p className="text-sm text-muted-foreground">Loading board…</p>}

        {data && pins.length === 0 && (
          <div className="rounded-md border bg-card text-card-foreground p-8 text-center">
            <p className="text-muted-foreground">This board is empty.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start adding pins to this board!
            </p>
          </div>
        )}

        {data && pins.length > 0 && (
          data.userRole.canEdit ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="board-pins" direction="horizontal" isDropDisabled={false}>
                {(provided: any) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <Masonry 
                      items={pins} 
                      renderItem={(p) => {
                        const idx = pins.findIndex(pin => pin.id === p.id)
                        return (
                          <Draggable key={p.id} draggableId={p.id} index={idx}>
                            {(pProvided: any, snapshot: any) => (
                              <div
                                ref={pProvided.innerRef}
                                {...pProvided.draggableProps}
                                {...pProvided.dragHandleProps}
                                className={`transition ${
                                  snapshot.isDragging ? "ring-2 ring-primary" : ""
                                }`}
                              >
                                <PinCard 
                                  pin={p} 
                                  isInBoard={true}
                                  onRemoveFromBoard={() => remove(p.id)}
                                />
                              </div>
                            )}
                          </Draggable>
                        )
                      }} 
                      className="mt-2" 
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <Masonry 
              items={pins} 
              renderItem={(p) => (
                <PinCard 
                  key={p.id}
                  pin={p} 
                  isInBoard={false}
                />
              )} 
              className="mt-2" 
            />
          )
        )}

        {/* Modals */}
        <BoardCollaboratorsModal
          open={collaboratorsModalOpen}
          onOpenChange={setCollaboratorsModalOpen}
          boardId={id}
          boardName={data?.board?.name || "Board"}
        />
        
        <BoardShareModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          boardId={id}
          boardName={data?.board?.name || "Board"}
        />
        
        <EditBoardModal
          open={editBoardModalOpen}
          onOpenChange={setEditBoardModalOpen}
          boardId={id}
          boardName={data?.board?.name || "Board"}
          boardDescription={data?.board?.description || ""}
          isSecret={!data?.board?.is_public}
          collaboratorCount={data?.board?.collaboratorCount || 0}
          userRole={data?.userRole || {
            isOwner: false,
            isCollaborator: false,
            collaborationRole: null,
            canEdit: false,
            canManageCollaborators: false
          }}
          onBoardUpdated={() => {
            console.log('Refreshing board data...')
            mutate()
          }}
          onOpenCollaborators={() => setCollaboratorsModalOpen(true)}
        />
      </div>
    </AppLayout>
  )
}

export default function BoardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <BoardDetailPageContent params={params} />
}
