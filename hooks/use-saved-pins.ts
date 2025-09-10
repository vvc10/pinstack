import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'

export function useSavedPins() {
  const [savedPinIds, setSavedPinIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  

  // Fetch all saved pin IDs for the current user
  const fetchSavedPins = useCallback(async () => {
    if (!user) {
      setSavedPinIds(new Set())
      return
    }

    setLoading(true)
    try {
      console.log('🔍 Fetching saved pins for user:', user.id)
      const response = await fetch('/api/pins/saved-pins')
      console.log('📡 Response status:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error:', response.status, errorText)
        return
      }
      
      const data = await response.json()
      console.log('📦 API Response data:', data)
      
      const pinIds = new Set(data.items?.map((pin: any) => pin.id) || [])
      console.log('✅ Saved pins fetched:', Array.from(pinIds))
      setSavedPinIds(pinIds)
    } catch (error) {
      console.error('❌ Error fetching saved pins:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Check if a specific pin is saved
  const isPinSaved = useCallback((pinId: string) => {
    return savedPinIds.has(pinId)
  }, [savedPinIds])

  // Add a pin to saved pins (optimistic update)
  const addToSaved = useCallback((pinId: string) => {
    setSavedPinIds(prev => new Set([...prev, pinId]))
  }, [])

  // Remove a pin from saved pins (optimistic update)
  const removeFromSaved = useCallback((pinId: string) => {
    setSavedPinIds(prev => {
      const newSet = new Set(prev)
      newSet.delete(pinId)
      return newSet
    })
  }, [])

  // Load saved pins when user changes
  useEffect(() => {
    if (!user) {
      setSavedPinIds(new Set())
      return
    }

    setLoading(true)
    const fetchData = async () => {
      try {
        const response = await fetch('/api/pins/saved-pins')
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ API Error:', response.status, errorText)
          return
        }
        
        const data = await response.json()
        const pinIds = new Set(data.items?.map((pin: any) => pin.id) || [])
        setSavedPinIds(pinIds)
      } catch (error) {
        console.error('❌ Error fetching saved pins:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.id])

  return {
    savedPinIds,
    isPinSaved,
    addToSaved,
    removeFromSaved,
    loading,
    refetch: fetchSavedPins
  }
}
