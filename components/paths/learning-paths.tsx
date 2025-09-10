"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { PATHS } from "@/data/paths"
import type { LearningPath } from "@/types/path"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "pinstack:learning-progress:v1"

type ProgressMap = Record<string, string[]> // pathId -> completed stepIds

function useLearningProgress() {
  const [progress, setProgress] = useState<ProgressMap>({})

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
      if (raw) setProgress(JSON.parse(raw))
    } catch {
      // ignore parse errors
    }
  }, [])

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
      }
    } catch {
      // quota/security errors ignored
    }
  }, [progress])

  function toggle(pathId: string, stepId: string) {
    setProgress((prev) => {
      const existing = new Set(prev[pathId] ?? [])
      if (existing.has(stepId)) existing.delete(stepId)
      else existing.add(stepId)
      return { ...prev, [pathId]: Array.from(existing) }
    })
  }

  function resetPath(pathId: string) {
    setProgress((prev) => {
      const next = { ...prev }
      delete next[pathId]
      return next
    })
  }

  function resetAll() {
    setProgress({})
  }

  return { progress, toggle, resetPath, resetAll }
}

function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      className="h-2 w-full rounded bg-muted overflow-hidden"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
    </div>
  )
}

function PathCard({
  path,
  completed,
  onToggle,
  onReset,
}: {
  path: LearningPath
  completed: Set<string>
  onToggle: (stepId: string) => void
  onReset: () => void
}) {
  const total = path.steps.length
  const done = completed.size
  const pct = Math.round((done / Math.max(1, total)) * 100)
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="rounded-md border bg-card text-card-foreground p-4 flex flex-col gap-3 min-w-[280px]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold leading-tight text-pretty">{path.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{path.description}</p>
        </div>
        <Button size="sm" variant="ghost" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
          {expanded ? "Hide" : "View"}
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <ProgressBar value={pct} />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {done}/{total}
        </span>
      </div>

      <div className="flex items-center flex-wrap gap-1.5">
        {path.tags.map((t) => (
          <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {t}
          </span>
        ))}
      </div>

      {expanded && (
        <ul className="mt-1 grid gap-2">
          {path.steps.map((s) => {
            const checked = completed.has(s.id)
            return (
              <li key={s.id} className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(s.id)}
                    aria-label={`Mark "${s.title}" as ${checked ? "incomplete" : "complete"}`}
                  />
                  <span className="text-sm">{s.title}</span>
                </label>
                <div className="flex items-center gap-2">
                  {s.estMinutes ? (
                    <span className="text-xs text-muted-foreground" aria-label="estimated minutes">
                      ~{s.estMinutes}m
                    </span>
                  ) : null}
                  {s.url ? (
                    <Button size="sm" variant="secondary" asChild>
                      <Link href={s.url} target="_blank" rel="noreferrer">
                        Open
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </li>
            )
          })}
          <div className="flex items-center justify-end">
            <Button size="sm" variant="outline" onClick={onReset}>
              Reset Path
            </Button>
          </div>
        </ul>
      )}
    </article>
  )
}

export function LearningPathsSection() {
  const { progress, toggle, resetPath, resetAll } = useLearningProgress()

  const items = useMemo(() => PATHS, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 id="learning-paths-heading" className="text-lg font-semibold">
          Learning Paths
        </h2>
        <Button size="sm" variant="ghost" onClick={resetAll}>
          Reset All
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
        {items.map((p) => (
          <PathCard
            key={p.id}
            path={p}
            completed={new Set(progress[p.id] ?? [])}
            onToggle={(stepId) => toggle(p.id, stepId)}
            onReset={() => resetPath(p.id)}
          />
        ))}
      </div>
    </div>
  )
}
