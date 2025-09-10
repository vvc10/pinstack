"use client"

import { useState, useEffect } from 'react'

interface ImageDimensions {
  width: number
  height: number
  aspectRatio: number
  orientation: 'landscape' | 'portrait' | 'square'
}

export function useImageDimensions(imageUrl: string): ImageDimensions | null {
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null)

  useEffect(() => {
    if (!imageUrl) return

    const img = new Image()
    
    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight
      let orientation: 'landscape' | 'portrait' | 'square'
      
      if (aspectRatio > 1.1) {
        orientation = 'landscape'
      } else if (aspectRatio < 0.9) {
        orientation = 'portrait'
      } else {
        orientation = 'square'
      }

      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio,
        orientation
      })
    }

    img.onerror = () => {
      // Fallback for failed image loads
      setDimensions({
        width: 400,
        height: 300,
        aspectRatio: 1.33,
        orientation: 'landscape'
      })
    }

    img.src = imageUrl
  }, [imageUrl])

  return dimensions
}

// Helper function to calculate optimal display height based on container width
export function calculateDisplayHeight(
  imageDimensions: ImageDimensions | null,
  containerWidth: number = 300,
  minHeight: number = 200,
  maxHeight: number = 600
): number {
  if (!imageDimensions) return minHeight

  const { aspectRatio } = imageDimensions
  const calculatedHeight = containerWidth / aspectRatio
  
  // Clamp between min and max height
  return Math.max(minHeight, Math.min(maxHeight, calculatedHeight))
}

// Helper function to get responsive container width based on screen size
export function getResponsiveContainerWidth(screenSize: 'sm' | 'md' | 'lg' | 'xl'): number {
  switch (screenSize) {
    case 'sm':
      return 280 // 1 column
    case 'md':
      return 320 // 2 columns
    case 'lg':
      return 300 // 3 columns
    case 'xl':
      return 280 // 4 columns
    default:
      return 300
  }
}
