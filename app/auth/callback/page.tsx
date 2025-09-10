"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()
  const supabase = getSupabaseBrowser()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/sign-in?error=auth_callback_error')
          return
        }

        if (data.session) {
          // Successfully authenticated, redirect to home
          router.push('/home')
        } else {
          // No session, redirect to sign in
          router.push('/sign-in')
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error)
        router.push('/sign-in?error=unexpected_error')
      }
    }

    handleAuthCallback()
  }, [router, supabase.auth])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">preparing your pins, wait a min...</p>
      </div>
    </div>
  )
}
