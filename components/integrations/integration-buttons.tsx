"use client"

import { Button } from "@/components/ui/button"
import { CustomTooltip } from "@/components/ui/custom-tooltip"

function parseGithub(repoUrl?: string): { owner: string; repo: string } | null {
  if (!repoUrl) return null
  try {
    const u = new URL(repoUrl)
    if (u.hostname !== "github.com") return null
    const parts = u.pathname.replace(/^\/+/, "").split("/")
    if (parts.length < 2) return null
    const [owner, repo] = parts
    return { owner, repo: repo.replace(/\.git$/, "") }
  } catch {
    return null
  }
}

export function IntegrationButtons({
  repoUrl,
  title = "pinstack Project",
}: {
  repoUrl?: string
  title?: string
}) {
  const gh = parseGithub(repoUrl)
  const hasRepo = !!gh

  const v0Href = hasRepo ? `https://v0.dev/r/${gh!.owner}/${gh!.repo}` : undefined
  const claudeHref = hasRepo ? `https://claude.ai/explore/${gh!.owner}/${gh!.repo}` : undefined

  return (
    <div className="flex flex-wrap items-center gap-2">
      <CustomTooltip content="Coming soon" side="top">
        <Button
          size="sm"
          variant="secondary"
          className="rounded-xl"
          asChild={!!v0Href}
          aria-label="Open in V0"
          aria-disabled={!v0Href}
          disabled={!v0Href}
        >
          {v0Href ? (
            <a href={v0Href} target="_blank" rel="noopener noreferrer">
              Open in V0
            </a>
          ) : (
            <span>Open in V0</span>
          )}
        </Button>
      </CustomTooltip>

      <CustomTooltip content="Coming soon" side="top">
        <Button
          size="sm"
          variant="secondary"
          className="rounded-xl"
          asChild={!!claudeHref}
          aria-label="Open in Claude"
          aria-disabled={!claudeHref}
          disabled={!claudeHref}
        >
          {claudeHref ? (
            <a href={claudeHref} target="_blank" rel="noopener noreferrer">
              Open in Claude
            </a>
          ) : (
            <span>Open in Claude</span>
          )}
        </Button>
      </CustomTooltip>
    </div>
  )
}
