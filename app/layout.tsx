import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { AuthRedirect } from "@/components/auth/auth-redirect"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "pinstack",
  description: "Pinterest for Developers — discover, curate, and collaborate on code ideas",
  generator: "pinstack",
}

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${dmSans.variable} ${GeistMono.variable} antialiased`}>
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <AuthRedirect>
              <Suspense fallback={null}>
                <main id="content" role="main" className="min-h-screen">
                  {children}
                </main>
              </Suspense>
            </AuthRedirect>
            <Analytics />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
