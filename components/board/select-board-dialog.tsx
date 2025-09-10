"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import type { Pin } from "@/types/pin"
import { useSavedPins } from "@/hooks/use-saved-pins"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type BoardsResp = { boards: { id: string; name: string; count: number }[] }

export function SelectBoardDialog({
  open,
  onOpenChange,
  pin,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  pin: Pin
}) {
  const { data, mutate } = useSWR<BoardsResp>("/api/boards", fetcher)
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const { addToSaved } = useSavedPins()

  async function createBoard() {
    const res = await fetch("/api/boards", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name }),
    })
    if (!res.ok) {
      toast({ title: "Failed to create board", description: "Please try again.", variant: "destructive" })
      return
    }
    await mutate()
    setName("")
  }

  async function addToBoard(boardId: string) {
    // single-add convenience (click row/button)
    const res = await fetch(`/api/boards/${boardId}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pin }),
    })
    if (!res.ok) {
      toast.error("❌ Failed to Save", {
        description: "Something went wrong while saving to board. Please try again.",
        duration: 4000,
      })
      return
    }
    // Update saved state
    addToSaved(pin.id)
    toast.success("📌 Saved to Board!", {
      description: `"${pin.title}" has been added to your board successfully!`,
      duration: 4000,
    })
    onOpenChange(false)
  }

  async function saveSelected() {
    const ids = Object.keys(selected).filter((id) => selected[id])
    if (!ids.length) return
    setSaving(true)
    try {
      await Promise.all(
        ids.map((id) =>
          fetch(`/api/boards/${id}`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ pin }),
          }),
        ),
      )
      // Update saved state
      addToSaved(pin.id)
      toast.success("📌 Saved to Boards!", {
        description: `"${pin.title}" has been added to ${ids.length} board${ids.length > 1 ? "s" : ""}!`,
        duration: 4000,
      })
      onOpenChange(false)
    } catch {
      toast.error("❌ Failed to Save", {
        description: "Something went wrong while saving to boards. Please try again.",
        duration: 4000,
      })
    } finally {
      setSaving(false)
    }
  }

  const boards = data?.boards || []
  const anySelected = useMemo(() => Object.values(selected).some(Boolean), [selected])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl [&>div]:rounded-2xl">
        <DialogHeader>
          <DialogTitle>Save to Boards</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label className="text-sm">Your Boards</Label>
            <div className="grid gap-2">
              {boards.length === 0 && <p className="text-sm text-muted-foreground">No boards yet.</p>}
              {boards.map((b) => {
                const checked = !!selected[b.id]
                return (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded border px-3 py-2 hover:bg-muted transition"
                  >
                    <label className="flex items-center gap-2 flex-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => setSelected((s) => ({ ...s, [b.id]: e.target.checked }))}
                        aria-label={`Select board ${b.name}`}
                      />
                      <span className="truncate">{b.name}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{b.count} pins</span>
                      <Button size="sm" variant="secondary" onClick={() => addToBoard(b.id)}>
                        Save
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-end">
              <Button onClick={saveSelected} disabled={!anySelected || saving} aria-label="Save to selected boards">
                {saving ? "Saving…" : "Save Selected"}
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="new-board" className="text-sm">
              Create New Board
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="new-board"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., UI Inspiration"
              />
              <Button onClick={createBoard} disabled={!name.trim()}>
                Create
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
