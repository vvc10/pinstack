"use client"

import { useEffect, useState } from "react"

// Force dynamic rendering
export const dynamic = 'force-dynamic'
import { ChallengeCard } from "@/components/hackathon/challenge-card"
import { AppLayout } from "@/components/layout/app-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import type { Hackathon } from "@/types/hackathon"

export default function HackathonsPage() {
  const [items, setItems] = useState<Hackathon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/hackathons")
        const data = await res.json()
        setItems(data.items || [])
      } catch (error) {
        console.error("Failed to fetch hackathons:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <AuthGuard>
      <AppLayout currentTab="hackathons">
        <div>
          <div className="mb-6">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-balance">Hackathon Hub</h1>
            <p className="text-sm text-muted-foreground mt-1">Join challenges and submit your project.</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((h) => (
                <ChallengeCard key={h.id} h={h} />
              ))}
            </div>
          )}
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
