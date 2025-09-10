"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

type VideoLightboxProps = {
  open: boolean
  onOpenChange: (v: boolean) => void
  title?: string
  videoUrl: string
}

export function VideoLightbox({ open, onOpenChange, title = "Video", videoUrl }: VideoLightboxProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="text-pretty">{title}</DialogTitle>
          <DialogDescription className="sr-only">Video player modal</DialogDescription>
        </DialogHeader>
        <div className="w-full bg-muted">
          <video className="w-full h-auto" src={videoUrl} controls preload="metadata" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
