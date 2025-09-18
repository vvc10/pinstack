"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { MasonryPinterest } from "@/components/masonry-pinterest"
import { useState, useEffect } from "react"
import { Pin } from "@/types/pin"

export default function RecentPage() {
  const [pins, setPins] = useState<Pin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecentPins()
  }, [])

  const fetchRecentPins = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Calculate 24 hours ago timestamp
      const twentyFourHoursAgo = new Date()
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)
      
      const response = await fetch(`/api/pins?sort=newest&limit=50`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch recent pins')
      }
      
      // Filter pins from last 24 hours
      const recentPins = data.items?.filter((pin: Pin) => {
        const pinDate = new Date(pin.created_at)
        return pinDate >= twentyFourHoursAgo
      }) || []
      
      setPins(recentPins)
    } catch (err) {
      console.error('Error fetching recent pins:', err)
      setError(err instanceof Error ? err.message : 'Failed to load recent pins')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AppLayout currentTab="recent">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading recent pins...</p>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout currentTab="recent">
        <div className="text-center py-20">
          <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-semibold mb-2">Error Loading Pins</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={fetchRecentPins}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </AppLayout>
    )
  }

  if (pins.length === 0) {
    return (
      <AppLayout currentTab="recent">
        <div className="text-center py-20">
          <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <span className="text-4xl">📅</span>
          </div>
          <h1 className="text-2xl font-semibold mb-2">Recent Activity</h1>
          <p className="text-muted-foreground">No pins posted in the last 24 hours.</p>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            Check back later for fresh content!
          </p>
          <a 
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <span>🏠</span>
            Go home
          </a>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout currentTab="recent">
      <div className="space-y-6">
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold mb-2">Recent Pins</h1>
          <p className="text-muted-foreground">
            Fresh pins posted in the last 24 hours ({pins.length} pins)
          </p>
        </div>
        
        <MasonryPinterest pins={pins} />
      </div>
    </AppLayout>
  )
}
