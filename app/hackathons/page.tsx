import { ChallengeCard } from "@/components/hackathon/challenge-card"
import { AppLayout } from "@/components/layout/app-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import type { Hackathon } from "@/types/hackathon"

async function getData(): Promise<{ items: Hackathon[] }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_URL ? "https://" + process.env.NEXT_PUBLIC_VERCEL_URL : ""}/api/hackathons`,
    { cache: "no-store" },
  )
  return res.json()
}

async function HackathonsPageContent() {
  const { items } = await getData()
  return (
    <AppLayout currentTab="hackathons">
      <div>
        <div className="mb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-balance">Hackathon Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">Join challenges and submit your project.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((h) => (
            <ChallengeCard key={h.id} h={h} />
          ))}
        </div>
      </div>
    </AppLayout>
  )
}

export default function HackathonsPage() {
  return (
    <AuthGuard>
      <HackathonsPageContent />
    </AuthGuard>
  )
}
