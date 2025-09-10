"use client"

import type * as React from "react"

type MasonryProps<T> = {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  className?: string
  gap?: number
  columns?: {
    mobile?: number
    tablet?: number
    desktop?: number
    xl?: number
  }
}

export function MasonryPinterest<T>({
  items,
  renderItem,
  className = "",
  gap = 16,
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    xl: 4
  }
}: MasonryProps<T>) {
  const getColumnClasses = () => {
    const classes = []
    
    if (columns.mobile) classes.push(`columns-${columns.mobile}`)
    if (columns.tablet) classes.push(`sm:columns-${columns.tablet}`)
    if (columns.desktop) classes.push(`lg:columns-${columns.desktop}`)
    if (columns.xl) classes.push(`xl:columns-${columns.xl}`)
    
    return classes.join(' ')
  }

  return (
    <div className={`w-full ${className}`}>
      <div 
        className={getColumnClasses()}
        style={{
          columnGap: `${gap}px`,
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="break-inside-avoid"
            style={{
              marginBottom: `${gap}px`,
            }}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  )
}
