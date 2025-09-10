import { PinCardSkeleton } from "./pin-card-skeleton"

export function MasonrySkeleton({ items = 12 }: { items?: number }) {
  return (
    <div className="columns-1 sm:columns-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="mb-4 break-inside-avoid">
          <PinCardSkeleton />
        </div>
      ))}
    </div>
  )
}
