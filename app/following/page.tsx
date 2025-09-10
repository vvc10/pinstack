import { AppLayout } from "@/components/layout/app-layout"

export default function FollowingPage() {
  return (
    <AppLayout currentTab="following">
      <div>
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <span className="text-4xl">👥</span>
            </div>
            <h1 className="text-2xl font-semibold mb-2">Following</h1>
            <p className="text-muted-foreground">Nothing to see now.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Pins from people you follow will appear here.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
