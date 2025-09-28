"use client"

import { Suspense } from "react"
import { AppLayout } from "./app-layout"

interface ServerAppLayoutProps {
  children: React.ReactNode
  currentTab?: string
  sort?: "trending" | "most-voted" | "newest"
  onSortChange?: (v: "trending" | "most-voted" | "newest") => void
}

function ServerAppLayoutContent({ children, currentTab, sort, onSortChange }: ServerAppLayoutProps) {
  return (
    <AppLayout currentTab={currentTab} sort={sort} onSortChange={onSortChange}>
      {children}
    </AppLayout>
  )
}

export function ServerAppLayout({ children, currentTab, sort, onSortChange }: ServerAppLayoutProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 max-w-full">
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <div className="md:ml-64">
              <div className="mt-10 sm:mt-10 md:mt-2 pb-20 md:pb-0">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <ServerAppLayoutContent currentTab={currentTab} sort={sort} onSortChange={onSortChange}>
        {children}
      </ServerAppLayoutContent>
    </Suspense>
  )
}
