"use client"

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

interface AuthRedirectProps {
  children: React.ReactNode
}

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/sign-in',
  '/sign-up',
  '/auth/callback',
  '/'
]

export function AuthRedirect({ children }: AuthRedirectProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return // Wait for auth to load

    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))
    
    // Redirect authenticated users away from landing (root) to home
    if (user && pathname === '/') {
      router.push('/home')
    }
  }, [user, loading, pathname, router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
