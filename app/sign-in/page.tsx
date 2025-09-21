"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/auth-context'
import { PublicRouteGuard } from '@/components/auth/auth-guard'
import { Chrome, Loader2 } from 'lucide-react'

function SignInForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signInWithGoogle } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Set dark mode as default if no theme is set
  useEffect(() => {
    // Only add dark mode if no theme is already set
    if (!document.documentElement.classList.contains('dark') && !document.documentElement.classList.contains('light')) {
      document.documentElement.classList.add('dark');
    }
  }, []);

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
    <div
      className="min-h-screen relative flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/auth/image.png')" }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 w-full max-w-md">
      <Card className="w-full backdrop-blur supports-[backdrop-filter]:bg-background/70 rounded-3xl">
      <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">Welcome to pinstack</CardTitle>
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
              className="w-full rounded-xl cursor-pointer"
              size="lg"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Chrome className="mr-2 h-5 w-5" />
              )}
              {loading ? 'Signing in...' : 'Continue with Google'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              By signing in, you agree to our{" "}
              <a href="/terms" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
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
