export function BoardCardSkeleton() {
  return (
    <div className="rounded-md bg-card/60 border border-border p-4 animate-pulse">
      <div className="h-24 bg-muted rounded mb-3" />
      <div className="h-4 bg-muted rounded w-2/3 mb-2" />
      <div className="h-3 bg-muted rounded w-1/3" />
    </div>
  )
}
