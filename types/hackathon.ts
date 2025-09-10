export type Hackathon = {
  id: string
  title: string
  description: string
  prize?: string
  tags: string[]
  startAt: string // ISO
  endAt: string // ISO
  resources?: { label: string; url: string }[]
  rules?: string[]
}

export type Submission = {
  id: string
  hackathonId: string
  repoUrl: string
  demoUrl?: string
  notes?: string
  createdAt: string // ISO
  status: "pending" | "accepted" | "rejected"
}
