export type PathStep = {
  id: string
  title: string
  estMinutes?: number
  url?: string
}

export type LearningPath = {
  id: string
  title: string
  description: string
  tags: string[]
  steps: PathStep[]
}
