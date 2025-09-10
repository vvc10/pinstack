"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMinimalToast } from "@/hooks/use-minimal-toast"

export function ShareMenu({ url, title = "Check this out on pinstack" }: { url: string; title?: string }) {
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
