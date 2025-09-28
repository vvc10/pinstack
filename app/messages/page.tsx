import { ServerAppLayout } from "@/components/layout/server-app-layout"

export default function MessagesPage() {
  return (
    <ServerAppLayout currentTab="messages">
      <div>
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <span className="text-4xl">💬</span>
            </div>
            <h1 className="text-2xl font-semibold mb-2">Messages</h1>
            <p className="text-muted-foreground">Nothing to see now.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Your messages and conversations will appear here.
            </p>
          </div>
        </div>
      </div>
    </ServerAppLayout>
  )
}
