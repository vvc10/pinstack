const votes = new Map<string, number>()

export function getVotes(pinId: string): number {
  return votes.get(pinId) ?? 0
}

export function upvote(pinId: string): number {
  const next = (votes.get(pinId) ?? 0) + 1
  votes.set(pinId, next)
  return next
}

export function downvote(pinId: string): number {
  const current = votes.get(pinId) ?? 0
  const next = Math.max(0, current - 1)
  votes.set(pinId, next)
  return next
}
