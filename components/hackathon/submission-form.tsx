"use client"

import type React from "react"

import { useState } from "react"
import useSWR from "swr"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useMinimalToast } from "@/hooks/use-minimal-toast"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function SubmissionForm({ hackathonId }: { hackathonId: string }) {
  const toast = useMinimalToast()
  const [repoUrl, setRepoUrl] = useState("")
  const [demoUrl, setDemoUrl] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const { mutate } = useSWR(`/api/hackathons/${hackathonId}/submissions`, fetcher)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/hackathons/${hackathonId}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, demoUrl, notes }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Submission failed")
      toast.success("Submitted!")
      setRepoUrl("")
      setDemoUrl("")
      setNotes("")
      mutate()
    } catch (e: any) {
      toast.error(e?.message || "Submission failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="text-sm">GitHub Repo URL</label>
        <Input
          placeholder="https://github.com/owner/repo"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          required
          inputMode="url"
        />
      </div>
      <div>
        <label className="text-sm">Live Demo URL (optional)</label>
        <Input
          placeholder="https://demo.example.com"
          value={demoUrl}
          onChange={(e) => setDemoUrl(e.target.value)}
          inputMode="url"
        />
      </div>
      <div>
        <label className="text-sm">Notes (optional)</label>
        <Textarea
          placeholder="Tell us about your project..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Project"}
        </Button>
      </div>
    </form>
  )
}
