"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/auth-context'
import { PublicRouteGuard } from '@/components/auth/auth-guard'
import { Chrome } from 'lucide-react'

function SignInForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signInWithGoogle } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check for error from callback
  const authError = searchParams.get('error')
  const errorMessage = authError === 'auth_callback_error' 
    ? 'Authentication failed. Please try again.'
    : authError === 'unexpected_error'
    ? 'An unexpected error occurred. Please try again.'
    : null

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError(null)
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to pinstack</CardTitle>
          <CardDescription>
            Sign in to create, save, and share your favorite code snippets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(error || errorMessage) && (
            <Alert variant="destructive">
              <AlertDescription>
                {error || errorMessage}
              </AlertDescription>
            </Alert>
          )}
          
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            <Chrome className="mr-2 h-5 w-5" />
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SignInPage() {
  return (
    <PublicRouteGuard>
      <SignInForm />
    </PublicRouteGuard>
  )
}
