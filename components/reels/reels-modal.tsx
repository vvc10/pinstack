"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, X, Volume2, VolumeX, Play, Pause } from "lucide-react"
import { Pin } from "@/types/pin"
import { useRouter } from "next/navigation"

interface ReelsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialIndex?: number
}

export function ReelsModal({ open, onOpenChange, initialIndex = 0 }: ReelsModalProps) {
  const [videos, setVideos] = useState<Pin[]>([])
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [loading, setLoading] = useState(false)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  // Fetch videos when modal opens
  useEffect(() => {
    if (open) {
      fetchVideos()
    }
  }, [open])

  // Handle video play/pause when index changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause()
      setPlaying(false)
    }
  }, [currentIndex])

  const fetchVideos = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/pins?limit=50')
      const data = await response.json()
      const videoPins = data.items?.filter((pin: Pin) => pin.videoUrl) || []
      setVideos(videoPins)
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleVideoClick = () => {
    if (!videoRef.current) return
    
    if (videoRef.current.paused) {
      videoRef.current.play()
      setPlaying(true)
    } else {
      videoRef.current.pause()
      setPlaying(false)
    }
  }

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted
      setMuted(!muted)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        handlePrevious()
        break
      case 'ArrowDown':
        e.preventDefault()
        handleNext()
        break
      case ' ':
        e.preventDefault()
        handleVideoClick()
        break
      case 'm':
      case 'M':
        e.preventDefault()
        handleMuteToggle()
        break
      case 'Escape':
        onOpenChange(false)
        break
    }
  }

  const currentVideo = videos[currentIndex]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-md w-full h-[80vh] p-0 bg-black border-0 rounded-3xl"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="relative w-full h-full flex flex-col">
          {/* Header */}
          {/* <div className="absolute top-4 right-4 z-10 flex justify-end items-center">
            <div className="text-white text-sm font-medium">
              {currentIndex + 1} / {videos.length}
            </div>
          </div> */}

          {/* Navigation Buttons */}
          {videos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 rounded-full p-2 disabled:opacity-50"
              >
                <ChevronUp className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                disabled={currentIndex === videos.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 rounded-full p-2 disabled:opacity-50"
              >
                <ChevronDown className="w-6 h-6" />
              </Button>
            </>
          )}

          {/* Video Content */}
          <div className="flex-1 flex items-center justify-center">
            {loading ? (
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p>Loading reels...</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-white text-center p-8">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-xl font-semibold mb-2">No reels yet</h3>
                <p className="text-gray-300">You're all caught up!</p>
              </div>
            ) : currentVideo ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  src={currentVideo.videoUrl}
                  className="w-full h-full object-cover"
                  muted={muted}
                  playsInline
                  loop
                  onClick={handleVideoClick}
                />
                
                {/* Video Controls Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleVideoClick}
                      className="text-white hover:bg-white/20 rounded-full p-2"
                    >
                      {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMuteToggle}
                      className="text-white hover:bg-white/20 rounded-full p-2"
                    >
                      {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>

                {/* Video Info */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg font-semibold mb-1">{currentVideo.title}</h3>
                  <p className="text-sm text-gray-300 line-clamp-2">{currentVideo.description}</p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-4 right-4 text-white text-xs opacity-70 text-center">
            <p className="whitespace-nowrap">↑↓ Navigate • Space Play/Pause • M Mute • Esc Close</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
