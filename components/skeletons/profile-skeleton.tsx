export function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="size-16 rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded w-40" />
          <div className="h-4 bg-muted rounded w-64" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="h-20 bg-muted rounded" />
        <div className="h-20 bg-muted rounded" />
        <div className="h-20 bg-muted rounded" />
      </div>
    </div>
  )
}
