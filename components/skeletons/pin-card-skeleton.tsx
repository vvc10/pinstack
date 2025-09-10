export function PinCardSkeleton() {
  return (
    <div className="rounded-md bg-card/60 border border-border overflow-hidden animate-pulse">
      <div className="aspect-[4/5] bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="flex gap-2">
          <div className="h-4 bg-muted rounded w-16" />
          <div className="h-4 bg-muted rounded w-10" />
        </div>
      </div>
    </div>
  )
}
