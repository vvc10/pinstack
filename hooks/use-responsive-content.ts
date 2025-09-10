"use client"

import { useState, useEffect } from 'react'

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl'

export function useResponsiveContent() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg')
  const [columns, setColumns] = useState(3) // Default to 3 columns

  useEffect(() => {
    const updateBreakpoint = () => {
      // Get the actual content width, not the full screen width
      const contentElement = document.querySelector('[data-content-area]') as HTMLElement
      const width = contentElement ? contentElement.offsetWidth : window.innerWidth
      
      console.log('🖥️ Content width:', width, 'Screen width:', window.innerWidth)
      
      if (width < 400) {
        setBreakpoint('sm')
        setColumns(1)
        console.log('📱 Set to mobile: 1 column')
      } else if (width < 600) {
        setBreakpoint('sm')
        setColumns(2)
        console.log('📱 Set to small tablet: 2 columns')
      } else if (width < 800) {
        setBreakpoint('md')
        setColumns(2)
        console.log('📱 Set to tablet: 2 columns')
      } else if (width < 1000) {
        setBreakpoint('md')
        setColumns(3)
        console.log('📱 Set to large tablet: 3 columns')
      } else {
        setBreakpoint('lg')
        setColumns(3)
        console.log('🖥️ Set to desktop: 3 columns')
      }
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    
    // Force update on mount to ensure correct columns
    setTimeout(updateBreakpoint, 100)
    
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return { breakpoint, columns }
}
