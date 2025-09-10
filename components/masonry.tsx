import type * as React from "react"
import { useResponsive } from "@/hooks/use-responsive"

type MasonryProps<T> = {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  className?: string
  columnClassName?: string
  gap?: number
}

export function Masonry<T>({ 
  items, 
  renderItem, 
  className = "", 
  columnClassName = "",
  gap = 4 
}: MasonryProps<T>) {
  const { columns } = useResponsive()

  // Dynamic column classes based on screen size
  const getColumnClasses = () => {
    let columnClasses = ""
    switch (columns) {
      case 1:
        columnClasses = "columns-1"
        break
      case 2:
        columnClasses = "columns-1 sm:columns-2"
        break
      case 3:
        columnClasses = "columns-1 sm:columns-2 lg:columns-3"
        break
      case 4:
        columnClasses = "columns-1 sm:columns-2 lg:columns-3 xl:columns-3"
        break
      default:
        columnClasses = "columns-1 sm:columns-2 lg:columns-3"
    }
    return columnClasses
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Try CSS Grid approach for more reliable column control */}
      <div 
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap * 4}px`
        }}
      >
        {items.map((item, idx) => (
          <div 
            key={idx} 
            className={`${columnClassName}`}
            style={{
              // Ensure images maintain their natural aspect ratio
              display: 'block',
              width: '100%'
            }}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
      
       
    </div>
  )
}
