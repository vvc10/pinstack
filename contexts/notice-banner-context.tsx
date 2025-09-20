"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface NoticeBannerContextType {
  isVisible: boolean
  setIsVisible: (visible: boolean) => void
}

const NoticeBannerContext = createContext<NoticeBannerContextType | undefined>(undefined)

const NOTICE_BANNER_KEY = "pinstack-notice-banner-dismissed"

export function NoticeBannerProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true)

  // Load banner state from localStorage on mount
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(NOTICE_BANNER_KEY)
      if (dismissed === "true") {
        setIsVisible(false)
      }
    } catch (error) {
      // localStorage not available (SSR or private browsing)
      console.warn("localStorage not available for notice banner")
    }
  }, [])

  // Update localStorage when banner visibility changes
  const handleSetVisible = (visible: boolean) => {
    setIsVisible(visible)
    try {
      if (!visible) {
        localStorage.setItem(NOTICE_BANNER_KEY, "true")
      } else {
        localStorage.removeItem(NOTICE_BANNER_KEY)
      }
    } catch (error) {
      // localStorage not available (SSR or private browsing)
      console.warn("localStorage not available for notice banner")
    }
  }

  return (
    <NoticeBannerContext.Provider value={{ isVisible, setIsVisible: handleSetVisible }}>
      {children}
    </NoticeBannerContext.Provider>
  )
}

export function useNoticeBanner() {
  const context = useContext(NoticeBannerContext)
  if (context === undefined) {
    throw new Error("useNoticeBanner must be used within a NoticeBannerProvider")
  }
  return context
}
