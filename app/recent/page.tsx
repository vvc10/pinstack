import { AppLayout } from "@/components/layout/app-layout"

export default function RecentPage() {
  return (
    <AppLayout currentTab="recent">
      <div>
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <span className="text-4xl">📅</span>
            </div>
            <h1 className="text-2xl font-semibold mb-2">Recent Activity</h1>
            <p className="text-muted-foreground">Nothing to see now.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Your recent pins and activity will appear here.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
