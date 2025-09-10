"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const title = mode === "sign-in" ? "Sign in" : "Create your account"
  const cta = mode === "sign-in" ? "Sign in" : "Sign up"
  const altHref = mode === "sign-in" ? "/sign-up" : "/sign-in"
  const altText = mode === "sign-in" ? "Create an account" : "Have an account? Sign in"

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="text-xl font-semibold mb-2 text-balance">{title}</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {mode === "sign-in" ? "Welcome back to pinstack." : "Join pinstack to discover and save developer pins."}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          setLoading(true)
          setTimeout(() => {
            setLoading(false)
            toast({
              title: "Placeholder",
              description:
                mode === "sign-in"
                  ? "Signed in (mock). Replace with real auth later."
                  : "Account created (mock). Replace with real auth later.",
            })
          }, 600)
        }}
        className="space-y-4"
      >
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Please wait..." : cta}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Link href={altHref} className="text-sm text-primary underline-offset-4 hover:underline">
          {altText}
        </Link>
      </div>
    </div>
  )
}
