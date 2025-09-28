"use client"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

import { useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { BoardCardSkeleton } from "@/components/skeletons/board-card-skeleton"
import { AppLayout } from "@/components/layout/app-layout"
import { CreateBoardModal } from "@/components/board/create-board-modal"
import { AuthGuard } from "@/components/auth/auth-guard"


const fetcher = (url: string) => fetch(url).then((r) => r.json())

function BoardsPageContent() {
  const { data, mutate } = useSWR<{ boards: { id: string; name: string; count: number; isCollaborator?: boolean; collaborationRole?: string }[] }>("/api/boards", fetcher)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const handleBoardCreated = (board: any) => {
    mutate() // Refresh the boards list
  }

  const boards = data?.boards || []
  const isLoading = !data

  return (
    <AppLayout currentTab="boards">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-balance">Your Boards</h1>
          <Button variant="default" className="rounded-xl cursor-pointer" onClick={() => setCreateModalOpen(true)}>
            <Plus className="size-4 mr-2" />
            New Board
          </Button>
        </div>

        {!isLoading && boards.length === 0 ? (
          <div className="rounded-md border bg-card text-card-foreground p-6 text-center">
            <p className="text-sm text-muted-foreground">No boards yet.</p>
            <Button className="mt-3" onClick={() => setCreateModalOpen(true)}>
              <Plus className="size-4 mr-2" />
              Create your first board
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <BoardCardSkeleton key={i} />)
              : boards.map((b) => (
                  <Link key={b.id} href={`/boards/${b.id}`}>
                    <Card className="hover:ring-2 hover:ring-primary transition">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-balance">{b.name}</CardTitle>
                          {b.isCollaborator && (
                            <Badge variant="secondary" className="text-xs">
                              collab
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{b.count} pins</p>
                        {b.isCollaborator && b.collaborationRole && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Role: {b.collaborationRole}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
          </div>
        )}
      </div>

      {/* Create Board Modal */}
      <CreateBoardModal 
        open={createModalOpen} 
        onOpenChange={setCreateModalOpen}
        onBoardCreated={handleBoardCreated}
      />
    </AppLayout>
  )
}

export default function BoardsPage() {
  return (
    <AuthGuard>
      <BoardsPageContent />
    </AuthGuard>
  )
}
