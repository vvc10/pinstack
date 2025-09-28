"use client"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

import { AppLayout } from "@/components/layout/app-layout"
import { LearningPathsSection } from "@/components/paths/learning-paths"

export default function LearningsPage() {
  return (
    <AppLayout currentTab="learnings">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-balance mb-2">Learning Paths</h1>
          <p className="text-muted-foreground">
            Structured learning paths to help you master different technologies and concepts.
          </p>
        </div>
        
        <LearningPathsSection />
      </div>
    </AppLayout>
  )
}
