import type React from "react"
import type { Metadata } from "next"
import { DM_Sans, DM_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { NoticeBannerProvider } from "@/contexts/notice-banner-context"
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

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-geist-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${dmSans.variable} ${dmMono.variable} antialiased`}>
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <NoticeBannerProvider>
              <AuthRedirect>
                <Suspense fallback={null}>
                  <main id="content" role="main" className="min-h-screen">
                    {children}
                  </main>
                </Suspense>
              </AuthRedirect>
              <Analytics />
              <Toaster />
            </NoticeBannerProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
