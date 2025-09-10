"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Users, Eye, EyeOff, Globe, Lock } from "lucide-react"
import { toast } from "sonner"

interface EditBoardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  boardId: string
  boardName: string
  boardDescription?: string
  isSecret?: boolean
  collaboratorCount?: number
  userRole: {
    isOwner: boolean
    isCollaborator: boolean
    collaborationRole: string | null
    canEdit: boolean
    canManageCollaborators: boolean
  }
  onBoardUpdated?: () => void
  onOpenCollaborators?: () => void
}

export function EditBoardModal({ 
  open, 
  onOpenChange, 
  boardId, 
  boardName, 
  boardDescription = "", 
  isSecret = false,
  collaboratorCount = 0,
  userRole,
  onBoardUpdated,
  onOpenCollaborators
}: EditBoardModalProps) {
  const [formData, setFormData] = useState({
    name: boardName,
    description: boardDescription,
    isPublic: !isSecret // Convert isSecret to isPublic for better UX
  })
  const [loading, setLoading] = useState(false)
  const [collaborators, setCollaborators] = useState<any[]>([])
  const [collaboratorsLoading, setCollaboratorsLoading] = useState(false)

  // Update form data when props change
  useEffect(() => {
    setFormData({
      name: boardName,
      description: boardDescription,
      isPublic: !isSecret // Convert isSecret to isPublic for better UX
    })
  }, [boardName, boardDescription, isSecret])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error("Board name is required")
      return
    }

    // Check if user has edit permissions
    if (!userRole.canEdit) {
      toast.error("You don't have permission to edit this board")
      return
    }

    setLoading(true)
    try {
      const requestData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        isSecret: !formData.isPublic // Convert isPublic back to isSecret for API
      }
      
      console.log('Sending board update request:', requestData)
      
      const response = await fetch(`/api/boards/${boardId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update board')
      }

      const result = await response.json()
      console.log('Board update response:', result)

      toast.success("🎉 Board Updated!", {
        description: `"${formData.name}" has been successfully updated!`,
        duration: 4000,
      })

      onBoardUpdated?.()
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating board:', error)
      toast.error("❌ Failed to Update Board", {
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        duration: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  // Don't show modal if user doesn't have edit permissions
  if (!userRole.canEdit) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl [&>div]:rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit board</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Board Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-board-name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="edit-board-name"
              placeholder='Like "Places to Go" or "Recipes to Make"'
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="rounded-xl"
              required
            />
          </div>

          {/* Board Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-board-description" className="text-sm font-medium">
              Description (optional)
            </Label>
            <Input
              id="edit-board-description"
              placeholder="Tell us what this board is about..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="rounded-xl"
            />
          </div>

          {/* Board Visibility & Collaborators */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-xl border">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="edit-visibility-toggle" className="text-sm font-medium flex items-center gap-2">
                    {formData.isPublic ? (
                      <Globe className="h-4 w-4 text-green-600" />
                    ) : (
                      <Lock className="h-4 w-4 text-amber-600" />
                    )}
                    {formData.isPublic ? "Public Board" : "Private Board"}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {formData.isPublic 
                      ? "Anyone with the link can view this board"
                      : "Only you and collaborators can see this board"
                    }
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {formData.isPublic ? "Public" : "Private"}
                  </span>
                  <Switch
                    id="edit-visibility-toggle"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
                  />
                </div>
              </div>
              
              {/* Collaborators Info */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Collaborators</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {collaboratorCount} {collaboratorCount === 1 ? 'person' : 'people'}
                  </Badge>
                  {userRole.canManageCollaborators && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => {
                        onOpenChange(false)
                        onOpenCollaborators?.()
                      }}
                    >
                      Manage
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="rounded-xl px-6"
            >
              {loading ? "Updating..." : "Update Board"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
