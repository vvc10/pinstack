"use client"

import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface VoteUpdate {
  pinId: string
  count: number
  isLiked: boolean
  userId: string
  action: 'like' | 'unlike'
}

export function useRealtimeVotes(pinId: string) {
  const [voteCount, setVoteCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowser()
    
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id || null)
      return user?.id || null
    }
    
    // Fetch initial vote data
    const fetchInitialData = async () => {
      try {
        const userId = await getCurrentUser()
        const response = await fetch(`/api/votes?pinId=${pinId}${userId ? `&userId=${userId}` : ''}`)
        const data = await response.json()
        
        console.log('Initial vote data fetched:', data)
        
        if (data.count !== undefined) {
          setVoteCount(data.count)
        }
        if (data.isLiked !== undefined) {
          setIsLiked(data.isLiked)
        }
      } catch (error) {
        console.error('Error fetching initial vote data:', error)
        // Set default values on error
        setVoteCount(0)
        setIsLiked(false)
      }
    }
    
    fetchInitialData()
    
    // Create a channel for this specific pin
    const voteChannel = supabase
      .channel(`votes:${pinId}`, {
        config: {
          broadcast: { self: true } // Allow receiving our own broadcasts
        }
      })
      .on(
        'broadcast',
        { event: 'vote_update' },
        (payload: any) => {
          console.log('📨 Raw broadcast received:', payload)
          const { pinId: updatedPinId, count, isLiked: updatedIsLiked, userId, action } = payload.payload as VoteUpdate
          
          console.log('📨 Received broadcast:', { updatedPinId, pinId, count, isLiked: updatedIsLiked, action, userId, currentUserId })
          
          // Only update if it's for this pin
          if (updatedPinId === pinId) {
            console.log('🔄 Real-time vote update:', { pinId: updatedPinId, count, isLiked: updatedIsLiked, action, userId })
            setVoteCount(count)
            
            // Update isLiked only if it's from the current user (for their own actions)
            if (userId === currentUserId && currentUserId) {
              console.log('💖 Updating isLiked for current user:', updatedIsLiked)
              setIsLiked(updatedIsLiked)
            } else {
              console.log('🚫 Not updating isLiked - userId:', userId, 'currentUserId:', currentUserId)
            }
          }
        }
      )
      .subscribe((status: any) => {
        console.log('📡 Vote channel status:', status)
        setIsConnected(status === 'SUBSCRIBED')
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to vote channel for pin:', pinId)
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Error subscribing to vote channel')
        }
      })

    setChannel(voteChannel)

    // Cleanup on unmount
    return () => {
      voteChannel.unsubscribe()
    }
  }, [pinId, currentUserId])

  // Function to broadcast vote updates
  const broadcastVote = async (count: number, isLiked: boolean, action: 'like' | 'unlike') => {
    if (!channel || !currentUserId) {
      console.log('❌ Cannot broadcast - missing channel or userId:', { channel: !!channel, currentUserId })
      return
    }

    const voteUpdate: VoteUpdate = {
      pinId,
      count,
      isLiked,
      userId: currentUserId,
      action
    }

    console.log('📢 Broadcasting vote update:', voteUpdate)
    
    try {
      const result = await channel.send({
        type: 'broadcast',
        event: 'vote_update',
        payload: voteUpdate
      })
      console.log('📤 Broadcast sent successfully:', result)
    } catch (error) {
      console.error('❌ Error sending broadcast:', error)
    }
  }

  return {
    voteCount,
    isLiked,
    isConnected,
    currentUserId,
    broadcastVote
  }
}
