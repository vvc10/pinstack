"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Mail, User, Eye, Edit, Pen } from "lucide-react"
import { toast } from "sonner"

interface BoardCollaboratorsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  boardId: string
  boardName: string
}

interface Collaborator {
  id: string
  email: string
  role: 'viewer' | 'editor'
  status: 'pending' | 'accepted' | 'declined'
  invited_at: string
  accepted_at?: string
  users?: {
    id: string
    username: string
    full_name?: string
    avatar_url?: string
  }
}

export function BoardCollaboratorsModal({ 
  open, 
  onOpenChange, 
  boardId, 
  boardName 
}: BoardCollaboratorsModalProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [newEmail, setNewEmail] = useState("")
  const [newRole, setNewRole] = useState<'viewer' | 'editor'>('viewer')
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)

  // Fetch collaborators when modal opens
  useEffect(() => {
    if (open && boardId) {
      fetchCollaborators()
    }
  }, [open, boardId])

  const fetchCollaborators = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/boards/${boardId}/collaborators`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch collaborators')
      }
      
      const { collaborators: data } = await response.json()
      setCollaborators(data || [])
    } catch (error) {
      console.error('Error fetching collaborators:', error)
      toast.error("Failed to load collaborators")
    } finally {
      setLoading(false)
    }
  }

  const addCollaborator = async () => {
    if (!newEmail.trim()) {
      toast.error("Email is required")
      return
    }

    setAdding(true)
    try {
      const response = await fetch(`/api/boards/${boardId}/collaborators`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: newEmail.trim(),
          role: newRole
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add collaborator')
      }

      // Check if this was a new user (no user data in response)
      const isNewUser = !result.collaborator?.users
      
      toast.success("✅ Collaborator Added!", {
        description: isNewUser 
          ? `Invitation sent to ${newEmail}. They'll get access when they sign up!`
          : `Invitation sent to ${newEmail}`,
        duration: 4000,
      })

      setNewEmail("")
      setNewRole('viewer')
      fetchCollaborators() // Refresh the list
    } catch (error: any) {
      console.error('Error adding collaborator:', error)
      toast.error("❌ Failed to Add Collaborator", {
        description: error.message || "Something went wrong. Please try again.",
        duration: 4000,
      })
    } finally {
      setAdding(false)
    }
  }

  const removeCollaborator = async (collaboratorId: string) => {
    try {
      const response = await fetch(`/api/boards/${boardId}/collaborators`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ collaboratorId })
      })

      if (!response.ok) {
        throw new Error('Failed to remove collaborator')
      }

      toast.success("✅ Collaborator Removed", {
        description: "Collaborator has been removed from the board",
        duration: 4000,
      })

      fetchCollaborators() // Refresh the list
    } catch (error: any) {
      console.error('Error removing collaborator:', error)
      toast.error("❌ Failed to Remove Collaborator", {
        description: error.message || "Something went wrong. Please try again.",
        duration: 4000,
      })
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'editor': return <Pen className="h-4 w-4" />
      case 'viewer': return <Eye className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted': return <Badge variant="default" className="text-xs bg-transparent border-border">Active</Badge>
      case 'pending': return <Badge variant="secondary" className="text-xs">Pending</Badge>
      case 'declined': return <Badge variant="destructive" className="text-xs">Declined</Badge>
      default: return <Badge variant="outline" className="text-xs">{status}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-2xl [&>div]:rounded-2xl">
        <DialogHeader>
          <DialogTitle>Manage Collaborators - {boardName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Collaborator */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Add Collaborator</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="flex-1 rounded-xl"
                  type="email"
                />
                <Select value={newRole} onValueChange={(value: any) => setNewRole(value)}>
                  <SelectTrigger className="w-32 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Viewer
                      </div>
                    </SelectItem>
                    <SelectItem value="editor">
                      <div className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Editor
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={addCollaborator}
                  disabled={adding || !newEmail.trim()}
                  size="sm"
                  className="rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {adding ? "Adding..." : "Add"}
                </Button>
              </div>
            </div>
          </div>

          {/* Collaborators List */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Collaborators ({collaborators.length})
            </Label>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading collaborators...</p>
              </div>
            ) : collaborators.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No collaborators yet</p>
                <p className="text-xs">Add collaborators to share this board</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto rounded-xl">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center justify-between p-3 border rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center">
                        {collaborator.users?.avatar_url ? (
                          <img 
                            src={collaborator.users.avatar_url} 
                            alt={collaborator.users.username}
                            className="h-8 w-8 rounded-xl"
                          />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {collaborator.users?.full_name || collaborator.users?.username || collaborator.email}
                          </p>
                          <div className="h-3 w-3 text-zinc-500 dark:text-zinc-400 rounded-xl flex items-center justify-center">
                          {getRoleIcon(collaborator.role)}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {collaborator.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusBadge(collaborator.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCollaborator(collaborator.id)}
                        className="h-8 w-8 p-0 rounded-md text-muted-foreground hover:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
