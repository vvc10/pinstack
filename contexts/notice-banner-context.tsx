"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface NoticeBannerContextType {
  isVisible: boolean
  setIsVisible: (visible: boolean) => void
}

const NoticeBannerContext = createContext<NoticeBannerContextType | undefined>(undefined)

const NOTICE_BANNER_KEY = "pinstack-notice-banner-dismissed"
const NOTICE_BANNER_VERSION_KEY = "pinstack-notice-banner-version"

// Update this version when you want to show the banner again after content changes
const CURRENT_BANNER_VERSION = "1.0.4"

export function NoticeBannerProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true)

  console.log("NoticeBannerProvider: Initial state", { isVisible })

  // Load banner state from localStorage on mount
  useEffect(() => {
    console.log("NoticeBannerProvider: useEffect running")
    
    try {
      const dismissed = localStorage.getItem(NOTICE_BANNER_KEY)
      const savedVersion = localStorage.getItem(NOTICE_BANNER_VERSION_KEY)
      
      console.log("Banner Debug:", {
        dismissed,
        savedVersion,
        currentVersion: CURRENT_BANNER_VERSION,
        willShow: dismissed !== "true" || savedVersion !== CURRENT_BANNER_VERSION
      })
      
      // Show banner if:
      // 1. Never dismissed before, OR
      // 2. Dismissed but version has changed (new content)
      if (dismissed !== "true" || savedVersion !== CURRENT_BANNER_VERSION) {
        console.log("Setting banner to visible - either never dismissed or version changed")
        setIsVisible(true)
        // Update the version in localStorage to current version
        localStorage.setItem(NOTICE_BANNER_VERSION_KEY, CURRENT_BANNER_VERSION)
        console.log("Banner will be visible")
      } else {
        console.log("Setting banner to hidden - dismissed and same version")
        setIsVisible(false)
        console.log("Banner will be hidden")
      }
    } catch (error) {
      // localStorage not available (SSR or private browsing)
      console.warn("localStorage not available for notice banner")
      console.log("Setting banner to visible due to error")
      setIsVisible(true)
    }
  }, [])

  // Update localStorage when banner visibility changes
  const handleSetVisible = (visible: boolean) => {
    setIsVisible(visible)
    try {
      if (!visible) {
        localStorage.setItem(NOTICE_BANNER_KEY, "true")
        // Keep the version so we can detect changes later
        localStorage.setItem(NOTICE_BANNER_VERSION_KEY, CURRENT_BANNER_VERSION)
      } else {
        localStorage.removeItem(NOTICE_BANNER_KEY)
        localStorage.removeItem(NOTICE_BANNER_VERSION_KEY)
      }
    } catch (error) {
      // localStorage not available (SSR or private browsing)
      console.warn("localStorage not available for notice banner")
    }
  }

  console.log("NoticeBannerProvider: Rendering with", { isVisible })

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
