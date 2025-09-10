"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Share2, Copy, ExternalLink, Users, Lock, Globe, Search, MessageCircle, Facebook, Twitter, Link } from "lucide-react"
import { toast } from "sonner"

interface BoardShareModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  boardId: string
  boardName: string
}

export function BoardShareModal({ 
  open, 
  onOpenChange, 
  boardId, 
  boardName 
}: BoardShareModalProps) {
  const [shareUrl, setShareUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [boardInfo, setBoardInfo] = useState<any>(null)

  // Generate share URL when modal opens
  useEffect(() => {
    if (open && boardId) {
      const url = `${window.location.origin}/boards/share/${boardId}`
      setShareUrl(url)
      fetchBoardInfo()
    }
  }, [open, boardId])

  const fetchBoardInfo = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/boards/${boardId}/share`)
      if (!response.ok) throw new Error('Failed to fetch board info')
      
      const { board } = await response.json()
      setBoardInfo(board)
    } catch (error) {
      console.error('Error fetching board info:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success("✅ Copied to Clipboard", {
        description: "Share link copied to clipboard",
        duration: 2000,
      })
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      toast.error("Failed to copy to clipboard")
    }
  }

  const openShareUrl = () => {
    window.open(shareUrl, '_blank')
  }

  const shareToSocial = (platform: string) => {
    const text = `Check out this board: ${boardName}`
    const encodedText = encodeURIComponent(text)
    const encodedUrl = encodeURIComponent(shareUrl)
    
    let socialShareUrl = ""
    switch (platform) {
      case 'twitter':
        socialShareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        break
      case 'facebook':
        socialShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'whatsapp':
        socialShareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`
        break
      case 'messenger':
        socialShareUrl = `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=YOUR_APP_ID`
        break
      default:
        return
    }
    
    window.open(socialShareUrl, '_blank', 'width=600,height=400')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl [&>div]:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Share
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Board Info */}
          <div className="text-center space-y-2">
            <h3 className="font-medium text-lg">{boardName}</h3>
            {boardInfo && (
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{boardInfo.collaboratorCount} collaborators</span>
                </div>
                <div className="flex items-center gap-1">
                  {boardInfo.isPublic ? (
                    <>
                      <Globe className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Public</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 text-amber-600" />
                      <span className="text-amber-600">Private</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Social Sharing Options */}
          <div className="space-y-4">
            <div className="flex flex-row justify-center gap-2">
              {/* Copy Link */}
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                className="h-16 w-16 rounded-xl mx-auto cursor-pointer"
                title="Copy link"
              >
                <Link className="h-6 w-6" />
              </Button>
              
              {/* WhatsApp */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => shareToSocial('whatsapp')}
                className="h-16 w-16 rounded-xl mx-auto bg-green-500 hover:bg-green-600 dark:bg-green-500 dark:hover:bg-green-600 text-white border-green-500 dark:border-green-500 cursor-pointer"
                title="WhatsApp"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </Button>
              
              {/* Messenger */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => shareToSocial('messenger')}
                className="h-16 w-16 rounded-xl mx-auto bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white border-blue-500 dark:border-blue-500 cursor-pointer"
                title="Messenger"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 4.975 0 11.11c0 3.497 1.745 6.6 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.11C24 4.975 18.627 0 12 0zm1.193 14.963l-3.056-3.259-5.616 3.259L10.733 8l3.13 3.259L19.439 8l-6.246 6.963z"/>
                </svg>
              </Button>
              
              {/* Facebook */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => shareToSocial('facebook')}
                className="h-16 w-16 rounded-xl mx-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white border-blue-600 dark:border-blue-600 cursor-pointer"
                title="Facebook"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </Button>
                     {/* X (Twitter) */}
                     <Button
                variant="outline"
                size="icon"
                onClick={() => shareToSocial('twitter')}
                className="h-16 w-16 rounded-xl mx-auto bg-black hover:bg-gray-800 dark:bg-black dark:hover:bg-gray-800 text-white border-black dark:border-black cursor-pointer"
                title="X (Twitter)"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Button>
            </div>
            
       
          </div>

          {/* Search for People - Commented out for now */}
          {/* <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email"
                className="pl-10 rounded-xl"
              />
              </div>
          </div> */}

          {/* Direct Link */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                className="flex-1 font-mono text-xs bg-muted/30 rounded-xl"
                    placeholder="Share URL will appear here..."
                  />
                  <Button
                    variant="outline"
                size="icon"
                    onClick={openShareUrl}
                    disabled={!shareUrl}
                className="h-10 w-10 rounded-xl"
              >
                <ExternalLink className="h-4 w-4" />
                  </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
