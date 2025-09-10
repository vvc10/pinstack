import { type NextRequest, NextResponse } from "next/server"
import { getVotes } from "../votes/_store"

// Simple badge rules for demo
function computeBadges({
  votes,
  lang,
  tags,
}: {
  votes: number
  lang: string
  tags: string[]
}): string[] {
  const b: string[] = []
  if (votes >= 10) b.push("Trending")
  if (votes >= 25) b.push("Hot")
  const l = lang.toLowerCase()
  if (["javascript", "typescript"].includes(l)) b.push("Web")
  if (l === "python") b.push("Data/AI")
  if (tags.some((t) => /beginner/i.test(t))) b.push("Beginner-friendly")
  if (tags.some((t) => /(perf|optimi[sz]ation)/i.test(t))) b.push("Performance")
  return Array.from(new Set(b))
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const pinId = searchParams.get("pinId")
  const lang = (searchParams.get("lang") || "").toString()
  const tags = (searchParams.get("tags") || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)

  if (!pinId) return NextResponse.json({ error: "pinId required" }, { status: 400 })

  const votes = getVotes(pinId)
  const badges = computeBadges({ votes, lang, tags })

  return NextResponse.json({ pinId, badges })
}
