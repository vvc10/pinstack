"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Search, User } from "lucide-react"
import { toast } from "sonner"

interface CreateBoardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBoardCreated?: (board: any) => void
}

interface Collaborator {
  id: string
  name: string
  email: string
  avatar?: string
}

export function CreateBoardModal({ open, onOpenChange, onBoardCreated }: CreateBoardModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isSecret: false
  })
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Collaborator[]>([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSearchCollaborators = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      // TODO: Implement actual user search API
      // For now, we'll simulate search results
      const mockResults: Collaborator[] = [
        { id: "1", name: "John Doe", email: "john@example.com" },
        { id: "2", name: "Jane Smith", email: "jane@example.com" },
        { id: "3", name: "Bob Johnson", email: "bob@example.com" }
      ].filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      )
      
      setSearchResults(mockResults)
    } catch (error) {
      console.error('Error searching collaborators:', error)
      toast.error("Failed to search users")
    } finally {
      setSearching(false)
    }
  }

  const addCollaborator = (collaborator: Collaborator) => {
    if (!collaborators.find(c => c.id === collaborator.id)) {
      setCollaborators(prev => [...prev, collaborator])
    }
    setSearchQuery("")
    setSearchResults([])
  }

  const removeCollaborator = (id: string) => {
    setCollaborators(prev => prev.filter(c => c.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error("Board name is required")
      return
    }

    setLoading(true)
    try {
      // First create the board
      const response = await fetch("/api/boards", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          isSecret: formData.isSecret
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create board')
      }

      const { board } = await response.json()
      
      // Then add collaborators if any
      if (collaborators.length > 0) {
        try {
          await Promise.all(
            collaborators.map(collaborator =>
              fetch(`/api/boards/${board.id}/collaborators`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  email: collaborator.email,
                  role: 'viewer'
                })
              })
            )
          )
        } catch (collaboratorError) {
          console.error('Error adding collaborators:', collaboratorError)
          // Don't fail the whole operation if collaborators fail
        }
      }
      
      toast.success("🎉 Board Created!", {
        description: `"${formData.name}" has been successfully created!`,
        duration: 4000,
      })

      // Reset form
      setFormData({
        name: "",
        description: "",
        isSecret: false
      })
      setCollaborators([])
      setSearchQuery("")
      setSearchResults([])

      onBoardCreated?.(board)
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating board:', error)
      toast.error("❌ Failed to Create Board", {
        description: "Something went wrong. Please try again.",
        duration: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl [&>div]:rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create board</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Board Name */}
          <div className="space-y-2">
            <Label htmlFor="board-name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="board-name"
              placeholder='Like "Places to Go" or "Recipes to Make"'
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="rounded-xl"
              required
            />
          </div>

          {/* Board Description */}
          <div className="space-y-2">
            <Label htmlFor="board-description" className="text-sm font-medium">
              Description (optional)
            </Label>
            <Input
              id="board-description"
              placeholder="Tell us what this board is about..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="rounded-xl"
            />
          </div>

          {/* Secret Board Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="secret-board" className="text-sm font-medium">
                  Keep this board secret
                </Label>
                <p className="text-xs text-muted-foreground">
                  So only you and collaborators can see it.{" "}
                  <button type="button" className="text-primary hover:underline">
                    Learn more
                  </button>
                </p>
              </div>
              <Switch
                id="secret-board"
                checked={formData.isSecret}
                onCheckedChange={(checked) => handleInputChange("isSecret", checked)}
              />
            </div>
          </div>

          {/* Add Collaborators */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Add collaborators</Label>
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  handleSearchCollaborators(e.target.value)
                }}
                className="pl-10 rounded-xl"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="border rounded-xl p-2 space-y-1 max-h-32 overflow-y-auto">
                {searchResults.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => addCollaborator(user)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors text-left"
                  >
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}

            {/* Selected Collaborators */}
            {collaborators.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Collaborators ({collaborators.length})</p>
                <div className="flex flex-wrap gap-2">
                  {collaborators.map((collaborator) => (
                    <Badge key={collaborator.id} variant="secondary" className="flex items-center gap-1">
                      <span className="text-xs">{collaborator.name}</span>
                      <button
                        type="button"
                        onClick={() => removeCollaborator(collaborator.id)}
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="rounded-xl px-6"
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
