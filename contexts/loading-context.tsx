"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface LoadingContextType {
  isLoading: boolean
  setLoading: (loading: boolean) => void
  loadingMessage?: string
  setLoadingMessage: (message?: string) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(undefined)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setLoading = (loading: boolean) => {
    setIsLoading(loading)
    if (!loading) {
      setLoadingMessage(undefined)
    }
  }

  // Handle route changes
  useEffect(() => {
    setLoading(true)
    setLoadingMessage('Loading...')
    
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setLoading(false)
      setLoadingMessage(undefined)
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, loadingMessage, setLoadingMessage }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
