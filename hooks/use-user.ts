"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import type { User } from '@/types/database'

export function useUser() {
  const { user: authUser, loading: authLoading } = useAuth()
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authUser) {
      setUserProfile(null)
      setLoading(false)
      return
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/users')
        if (!response.ok) {
          throw new Error('Failed to fetch user profile')
        }
        
        const data = await response.json()
        setUserProfile(data.user)
      } catch (err) {
        console.error('Error fetching user profile:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch user profile')
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [authUser])

  const updateProfile = async (updates: Partial<User>) => {
    try {
      setError(null)
      
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update user profile')
      }
      
      const data = await response.json()
      setUserProfile(data.user)
      return data.user
    } catch (err) {
      console.error('Error updating user profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to update user profile')
      throw err
    }
  }

  return {
    user: userProfile,
    loading: loading || authLoading,
    error,
    updateProfile,
    isAuthenticated: !!authUser
  }
}
