"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMinimalToast } from "@/hooks/use-minimal-toast"

export function ShareMenu({ 
  url, 
  title = "Check this out on pinstack", 
  open, 
  onOpenChange 
}: { 
  url: string; 
  title?: string; 
  open?: boolean; 
  onOpenChange?: (open: boolean) => void; 
}) {
  const toast = useMinimalToast()
  const canShare = typeof window !== "undefined" && !!navigator.share

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied")
    } catch {
      toast.error("Copy failed")
    }
  }

  const shareNative = async () => {
    try {
      await navigator.share({ title, url })
    } catch {
      // ignore cancel
    }
  }

  const shareX = () => {
    const u = new URL("https://twitter.com/intent/tweet")
    u.searchParams.set("text", title)
    u.searchParams.set("url", url)
    window.open(u.toString(), "_blank", "noopener,noreferrer")
  }

  const shareLinkedIn = () => {
    const u = new URL("https://www.linkedin.com/sharing/share-offsite/")
    u.searchParams.set("url", url)
    window.open(u.toString(), "_blank", "noopener,noreferrer")
  }

  // If open and onOpenChange are provided, use modal mode
  if (open !== undefined && onOpenChange) {
    if (!open) return null
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => onOpenChange(false)}>
        <div className="bg-card rounded-2xl p-6 shadow-lg max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-semibold mb-4">Share Pin</h3>
          <div className="space-y-3">
            <Button 
              onClick={copy} 
              className="w-full justify-start rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors"
              variant="outline"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </Button>
            <Button 
              onClick={shareX} 
              className="w-full justify-start rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors"
              variant="outline"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Share on X
            </Button>
            <Button 
              onClick={shareLinkedIn} 
              className="w-full justify-start rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors"
              variant="outline"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Share on LinkedIn
            </Button>
            {canShare && (
                <Button 
                  onClick={shareNative} 
                  className="w-full justify-start rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors"
                  variant="outline"
                >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                more options
              </Button>
            )}
          </div>
          <Button 
            onClick={() => onOpenChange(false)} 
            className="w-full mt-4 rounded-xl hover:text-zinc-700 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            variant="ghost"
          >
            Close
          </Button>
        </div>
      </div>
    )
  }

  if (canShare) {
    return (
      <Button 
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          shareNative()
        }} 

        className="flex items-center gap-2 px-4 py-4 bg-card rounded-xl cursor-pointer border border-border hover:bg-secondary dark:hover:bg-muted text-foreground transition-all duration-200 hover:scale-105"
        aria-label="Share"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
        Share
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          size="sm" 
          variant="ghost" 
          className="flex items-center gap-2 px-3 py-1 bg-card rounded-full shadow-sm border border-border hover:bg-card/80 transition-all duration-200 hover:scale-105"
          aria-label="Share menu"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copy}>Copy link</DropdownMenuItem>
        <DropdownMenuItem onClick={shareX}>Share on X</DropdownMenuItem>
        <DropdownMenuItem onClick={shareLinkedIn}>Share on LinkedIn</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
