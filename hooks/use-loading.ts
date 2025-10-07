"use client"

import { useCallback, useRef, useState } from "react"

type LoadingState = {
  loading: boolean
  message?: string
  startLoading: (message?: string) => void
  stopLoading: () => void
}

/**
 * Minimal client-only loading hook to satisfy existing imports.
 * - startLoading(message?) sets loading true and stores an optional message
 * - stopLoading() resets loading/message
 *
 * This intentionally does not render any UI; integrate with a toast or overlay if needed.
 */
export function useLoadingState(): LoadingState {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | undefined>(undefined)
  const pendingCount = useRef(0)

  const startLoading = useCallback((msg?: string) => {
    pendingCount.current += 1
    setMessage(msg)
    setLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    pendingCount.current = Math.max(0, pendingCount.current - 1)
    if (pendingCount.current === 0) {
      setLoading(false)
      setMessage(undefined)
    }
  }, [])

  return { loading, message, startLoading, stopLoading }
}
