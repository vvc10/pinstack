"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Hackathon } from "@/types/hackathon"

export function ChallengeCard({ h }: { h: Hackathon }) {
  const isActive = new Date(h.startAt) <= new Date() && new Date() <= new Date(h.endAt)
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-pretty">{h.title}</CardTitle>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {h.tags.map((t) => (
            <Badge key={t} variant="secondary" className="text-[11px] px-2 py-0.5">
              {t}
            </Badge>
          ))}
          <Badge variant={isActive ? "default" : "outline"} className="text-[11px] px-2 py-0.5">
            {isActive ? "Active" : "Upcoming/Ended"}
          </Badge>
          {h.prize ? (
            <Badge variant="outline" className="text-[11px] px-2 py-0.5">
              Prize: {h.prize}
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">{h.description}</p>
        <div className="text-xs text-muted-foreground">
          <span>
            From {new Date(h.startAt).toLocaleDateString()} to {new Date(h.endAt).toLocaleDateString()}
          </span>
        </div>
        <Link href={`/hackathons/${h.id}`} className="text-sm underline underline-offset-4">
          View details & submit →
        </Link>
      </CardContent>
    </Card>
  )
}
