import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

export default function ProfilePage({ params }: { params: { username: string } }) {
  return (
    <main className="container mx-auto px-4 py-6">
      <section className="flex items-center gap-4 mb-6">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{params.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">@{params.username}</h1>
          <p className="text-sm text-muted-foreground">Bio, badges, and stats will appear here.</p>
        </div>
      </section>

      <Card>
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground">
            User pins, boards, and activity feed will be implemented in upcoming milestones.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
