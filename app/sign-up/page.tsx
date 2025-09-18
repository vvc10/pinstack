"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/auth-context'
import { PublicRouteGuard } from '@/components/auth/auth-guard'
import { Chrome } from 'lucide-react'

function SignUpForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signInWithGoogle } = useAuth()

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true)
      setError(null)
      // We use the same OAuth flow; provider handles new vs existing users
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to continue with Google')
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
            <CardTitle className="text-2xl font-bold text-foreground">Create your pinstack account</CardTitle>
            <CardDescription>
              Continue with Google to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full rounded-xl cursor-pointer"
              size="lg"
            >
              <Chrome className="mr-2 h-5 w-5" />
              {loading ? 'Continuing…' : 'Continue with Google'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              By continuing, you agree to our{" "}
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

export default function SignUpPage() {
  return (
    <PublicRouteGuard>
      <SignUpForm />
    </PublicRouteGuard>
  )
}
