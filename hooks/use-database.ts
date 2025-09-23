"use client"

import { useState, useCallback } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/auth-context'
import type { Pin, Board, Hackathon, LearningPath } from '@/types/database'

// Pin operations hook
export function usePinOperations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = getSupabaseBrowser()

  const createPin = useCallback(async (pinData: {
    title: string
    description?: string
    code: string
    language: string
    component_type?: string
    tags: string[]
    image_url?: string
    credits?: string
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      if (!user) {
        throw new Error('User must be authenticated to create a pin')
      }
      
      const response = await fetch('/api/pins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pinData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create pin')
      }

      const data = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pin')
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const editPin = useCallback(async (pinId: string, pinData: {
    title: string
    description?: string
    code: string
    language: string
    component_type?: string
    tags: string[]
    image_url?: string
    credits?: string
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      if (!user) {
        throw new Error('User must be authenticated to edit a pin')
      }
      
      const response = await fetch(`/api/pins/${pinId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pinData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update pin')
      }

      const data = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update pin')
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const likePin = useCallback(async (pinId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      if (!user) {
        throw new Error('User must be authenticated to like a pin')
      }
      
      const { error } = await supabase
        .from('pin_likes')
        .insert([{
          pin_id: pinId,
          user_id: user.id
        }])

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like pin')
      throw err
    } finally {
      setLoading(false)
    }
  }, [supabase, user])

  const savePin = useCallback(async (pinId: string, boardId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      if (!user) {
        throw new Error('User must be authenticated to save a pin')
      }
      
      const { error } = await supabase
        .from('pin_saves')
        .insert([{
          pin_id: pinId,
          board_id: boardId,
          user_id: user.id
        }])

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save pin')
      throw err
    } finally {
      setLoading(false)
    }
  }, [supabase, user])

  return {
    createPin,
    editPin,
    likePin,
    savePin,
    loading,
    error
  }
}

// Board operations hook
export function useBoardOperations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = getSupabaseBrowser()

  const createBoard = useCallback(async (boardData: {
    name: string
    description?: string
    is_public?: boolean
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      if (!user) {
        throw new Error('User must be authenticated to create a board')
      }
      
      const { data, error } = await supabase
        .from('boards')
        .insert([{
          name: boardData.name,
          description: boardData.description,
          is_public: boardData.is_public ?? true,
          owner_id: user.id
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create board')
      throw err
    } finally {
      setLoading(false)
    }
  }, [supabase, user])

  const updateBoard = useCallback(async (boardId: string, updates: {
    name?: string
    description?: string
    is_public?: boolean
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('boards')
        .update(updates)
        .eq('id', boardId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update board')
      throw err
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const deleteBoard = useCallback(async (boardId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase
        .from('boards')
        .delete()
        .eq('id', boardId)

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete board')
      throw err
    } finally {
      setLoading(false)
    }
  }, [supabase])

  return {
    createBoard,
    updateBoard,
    deleteBoard,
    loading,
    error
  }
}

// Hackathon operations hook
export function useHackathonOperations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = getSupabaseBrowser()

  const createHackathon = useCallback(async (hackathonData: {
    title: string
    description: string
    start_date: string
    end_date: string
    prize_pool?: number
    rules?: string
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      if (!user) {
        throw new Error('User must be authenticated to create a hackathon')
      }
      
      const { data, error } = await supabase
        .from('hackathons')
        .insert([{
          ...hackathonData,
          organizer_id: user.id
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create hackathon')
      throw err
    } finally {
      setLoading(false)
    }
  }, [supabase, user])

  return {
    createHackathon,
    loading,
    error
  }
}

// Learning path operations hook
export function useLearningPathOperations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = getSupabaseBrowser()

  const createLearningPath = useCallback(async (pathData: {
    title: string
    description: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    estimated_hours: number
    tags: string[]
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      if (!user) {
        throw new Error('User must be authenticated to create a learning path')
      }
      
      const { data, error } = await supabase
        .from('learning_paths')
        .insert([{
          ...pathData,
          author_id: user.id
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create learning path')
      throw err
    } finally {
      setLoading(false)
    }
  }, [supabase, user])

  return {
    createLearningPath,
    loading,
    error
  }
}
