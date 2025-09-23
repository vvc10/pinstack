"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface NavbarProps {
  currentPage?: 'landing' | 'about' | 'components'
}

export function Navbar({ currentPage }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="sticky top-0 z-50 px-4 sm:px-0 py-3 sm:py-6">
      <header className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] mx-auto border-b bg-gradient-to-r from-background/80 via-background/90 to-background/80 backdrop-blur-md rounded-2xl shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
          <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Mobile Menu Button - Left side of logo */}
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden p-1 h-7 w-7"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-3.5 w-3.5" />
              ) : (
                <Menu className="h-3.5 w-3.5" />
              )}
            </Button>
            
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary font-bold rounded-lg flex items-center justify-center text-sm sm:text-base text-primary-foreground">
                Ps.
              </div>
              <span className="text-lg sm:text-xl font-bold">pinstack</span>
            </Link>
          </div>




            {/* Right side - Desktop Navigation + CTA Button */}
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Desktop Navigation Links */}
              <div className="hidden sm:flex items-center gap-4 lg:gap-6">
                <a
                  href="/#features"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Features
                </a>
                <a
                  href="/#how-it-works"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  How it Works
                </a>
                <Link
                  href="/components"
                  className={`text-xs sm:text-sm transition-colors duration-200 ${currentPage === 'components'
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  Components
                </Link>
              </div>

              {/* CTA Button - Both mobile and desktop */}
              <Button asChild size="sm" className="text-sm sm:text-base px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl">
                <Link href="/sign-in">
                  Login
                  <div className="ml-2 w-4 h-4 sm:w-6 sm:h-6 bg-foreground/10 rounded-md flex items-center justify-center">
                    <ArrowRight className="h-2 w-2 sm:h-3 sm:w-3" />
                  </div>
                </Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="sm:hidden mt-4 pb-4 border-t border-zinc-700/50">
              <div className="flex flex-col space-y-4 pt-4">
                <a
                  href="/#features"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="/#how-it-works"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How it Works
                </a>
                <Link
                  href="/components"
                  className={`text-sm transition-colors duration-200 py-2 ${currentPage === 'components'
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Components
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  )
}
