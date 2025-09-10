"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { VolumeX, Volume2 } from "lucide-react"

type Props = {
  title: string
  src: string
}

export function VideoCard({ title, src }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const onTime = () => {
      if (!el.duration) return
      setProgress((el.currentTime / el.duration) * 100)
    }
    el.addEventListener("timeupdate", onTime)
    return () => el.removeEventListener("timeupdate", onTime)
  }, [])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.6 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="relative rounded-md overflow-hidden border bg-black">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-auto"
        muted={muted}
        playsInline
        preload="metadata"
        controls={false}
        aria-label={title}
        onClick={() => {
          const el = videoRef.current
          if (!el) return
          if (el.paused) el.play().catch(() => {})
          else el.pause()
        }}
        onKeyDown={(e) => {
          const el = videoRef.current
          if (!el) return
          if (e.key === " ") {
            e.preventDefault()
            if (el.paused) el.play().catch(() => {})
            else el.pause()
          }
          if (e.key.toLowerCase() === "m") {
            setMuted((m) => !m)
          }
        }}
        tabIndex={0}
      />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
      </div>
      <div className="absolute top-2 right-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
