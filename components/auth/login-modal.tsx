"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/auth-context'
import { Chrome } from 'lucide-react'

interface LoginModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { signInWithGoogle } = useAuth()

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true)
            setError(null)
            await signInWithGoogle()
            // Close modal on successful sign in
            onOpenChange(false)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign in with Google')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogOverlay className="bg-black/50" />
            <DialogContent
                className="max-w-6xl w-[90%] h-[85vh] p-0 border-0 bg-transparent shadow-none"
                showCloseButton={false}
            >
                <div className="relative">
                    
                    {/* Overlay - Clickable to close */}

                    <div
                        className="absolute inset-0 bg-transparent cursor-pointer"
                        onClick={() => onOpenChange(false)}
                    />

                    {/* Content */}

                    <div className="relative z-10 p-8 h-full flex items-center justify-center">
                        <Card
                            className="w-full max-w-4xl backdrop-blur supports-[backdrop-filter]:bg-background rounded-3xl border-0"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <CardHeader className="text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="h-14 w-14 font-garamond rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                                        <span className="text-primary-foreground font-bold text-2xl">Ps.</span>
                                    </div>
                                </div>
                                <CardTitle className="text-3xl font-bold text-foreground">Welcome to pinstack</CardTitle>
                                <CardDescription className="text-lg">
                                    Sign in to create, save, and share your favorite code snippets
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>
                                            {error}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <Button
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    className="w-full rounded-xl cursor-pointer h-14 text-lg"
                                    size="lg"
                                >
                                    <Chrome className="mr-3 h-6 w-6" />
                                    {loading ? 'Signing in...' : 'Continue with Google'}
                                </Button>

                                <div className="text-center text-base text-muted-foreground">
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
            </DialogContent>
        </Dialog>
    )
}
