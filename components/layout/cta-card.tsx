"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Chrome, ArrowRight } from "lucide-react"
import Link from "next/link"

interface CTACardProps {
  title?: string
  description?: string
  buttonText?: string
  buttonHref?: string
  showImages?: boolean
}

export function CTACard({ 
  title = "Get your perfect UI components today",
  description = "Copy, paste, tweak, and ship. Beautiful UI components ready to use in your projects.",
  buttonText = "Start Creating",
  buttonHref = "/sign-in",
  showImages = true
}: CTACardProps) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 text-foreground dark:text-white overflow-hidden relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>
      
      <CardContent className="p-0 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Left Side - CTA Content */}
          <div className="p-6 sm:p-8 lg:p-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-foreground dark:text-white">
              {title}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground dark:text-zinc-300 mb-6 sm:mb-8 leading-relaxed">
              {description}
            </p>
            <Button 
              size="lg" 
              asChild 
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-medium transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              <Link href={buttonHref}>
                {buttonText}
              </Link>
            </Button>
          </div>
          
          {/* Right Side - Component Showcase Grid */}
          {showImages && (
            <div className="p-3 sm:p-4 lg:p-6">
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                  <img
                    src="/assets/landing/image.png"
                    alt="UI Component"
                    className="w-full h-auto rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                  <img
                    src="/assets/landing/image2.png"
                    alt="Dashboard UI"
                    className="w-full h-auto rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                </div>
                <div className="space-y-4 sm:space-y-6 lg:space-y-8 mt-4 sm:mt-6 lg:mt-8">
                  <img
                    src="/assets/landing/image3.png"
                    alt="Code Editor"
                    className="w-full h-auto rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                  <img
                    src="/assets/landing/image4.png"
                    alt="Dashboard UI"
                    className="w-full h-auto rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
