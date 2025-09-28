// Force dynamic rendering
export const dynamic = 'force-dynamic'

import Link from "next/link"
import { notFound } from "next/navigation"
import { use } from "react"
import type { Hackathon } from "@/types/hackathon"
import { SubmissionForm } from "@/components/hackathon/submission-form"
import { AppLayout } from "@/components/layout/app-layout"
import { AuthGuard } from "@/components/auth/auth-guard"

async function getData(id: string): Promise<{ hackathon: Hackathon; submissions: any[] } | null> {
  const base = process.env.NEXT_PUBLIC_VERCEL_URL ? "https://" + process.env.NEXT_PUBLIC_VERCEL_URL : ""
  const res = await fetch(`${base}/api/hackathons/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

async function HackathonDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const data = await getData(id)
  if (!data) return notFound()
  const { hackathon, submissions } = data

  return (
    <AppLayout currentTab="hackathons">
      <div>
        <Link href="/hackathons" className="text-sm underline underline-offset-4">
          ← Back to Hackathons
        </Link>
        <h1 className="mt-2 text-lg sm:text-xl md:text-2xl font-semibold text-balance">{hackathon.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{hackathon.description}</p>
        <div className="mt-3 text-xs text-muted-foreground">
          <span>
            From {new Date(hackathon.startAt).toLocaleDateString()} to {new Date(hackathon.endAt).toLocaleDateString()}
          </span>
        </div>

        {hackathon.resources?.length ? (
          <div className="mt-4">
            <h2 className="text-sm font-medium mb-2">Resources</h2>
            <ul className="list-disc pl-5 text-sm">
              {hackathon.resources.map((r) => (
                <li key={r.url}>
                  <a href={r.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {hackathon.rules?.length ? (
          <div className="mt-4">
            <h2 className="text-sm font-medium mb-2">Rules</h2>
            <ul className="list-disc pl-5 text-sm">
              {hackathon.rules.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <section className="mt-6">
          <h2 className="text-lg font-semibold">Submit your project</h2>
          <div className="mt-2">
            <SubmissionForm hackathonId={hackathon.id} />
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">Submissions</h2>
          <div className="mt-2 space-y-2">
            {!submissions?.length ? (
              <p className="text-sm text-muted-foreground">No submissions yet.</p>
            ) : (
              submissions.map((s: any) => (
                <div key={s.id} className="rounded-md border p-3 text-sm flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">
                      <a href={s.repoUrl} className="underline underline-offset-4" target="_blank" rel="noreferrer">
                        {s.repoUrl}
                      </a>
                    </div>
                    {s.demoUrl ? (
                      <div>
                        Demo:{" "}
                        <a href={s.demoUrl} className="underline underline-offset-4" target="_blank" rel="noreferrer">
                          {s.demoUrl}
                        </a>
                      </div>
                    ) : null}
                    {s.notes ? <div className="text-muted-foreground">{s.notes}</div> : null}
                  </div>
                  <span
                    className={
                      "text-xs px-2 py-0.5 rounded " +
                      (s.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : s.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700")
                    }
                  >
                    {s.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </AppLayout>
  )
}

export default function HackathonDetail({ params }: { params: Promise<{ id: string }> }) {
  return (
    <AuthGuard>
      <HackathonDetailContent params={params} />
    </AuthGuard>
  )
}
