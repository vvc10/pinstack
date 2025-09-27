"use client"

import { useLoading } from '@/contexts/loading-context'

export function useLoadingState() {
  const { isLoading, setLoading, loadingMessage, setLoadingMessage } = useLoading()

  const startLoading = (message?: string) => {
    setLoading(true)
    if (message) {
      setLoadingMessage(message)
    }
  }

  const stopLoading = () => {
    setLoading(false)
    setLoadingMessage(undefined)
  }

  const withLoading = async <T,>(
    asyncFn: () => Promise<T>,
    message?: string
  ): Promise<T> => {
    try {
      startLoading(message)
      const result = await asyncFn()
      return result
    } finally {
      stopLoading()
    }
  }

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    withLoading
  }
}
