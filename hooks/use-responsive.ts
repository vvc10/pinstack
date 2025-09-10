"use client"

import { useState, useEffect } from 'react'

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl'

export function useResponsive() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg')
  const [columns, setColumns] = useState(3) // Default to 3 columns

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      console.log('🖥️ Screen width:', width)
      
      if (width < 640) {
        setBreakpoint('sm')
        setColumns(1)
        console.log('📱 Set to mobile: 1 column')
      } else if (width < 768) {
        setBreakpoint('sm')
        setColumns(2)
        console.log('📱 Set to small tablet: 2 columns')
      } else if (width < 1024) {
        setBreakpoint('md')
        setColumns(3)
        console.log('📱 Set to tablet: 3 columns')
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
