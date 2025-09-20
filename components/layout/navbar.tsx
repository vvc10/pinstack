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
    <header className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] sticky top-3 sm:top-6 z-50 my-3 sm:my-6 mx-auto border-b bg-zinc-800/50 backdrop-blur rounded-2xl">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary font-bold rounded-lg flex items-center justify-center text-sm sm:text-base">
              P.
            </div>
            <span className="text-lg sm:text-xl font-bold">pinstack</span>
          </Link>
          
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
              className={`text-xs sm:text-sm transition-colors duration-200 ${
                currentPage === 'components' 
                  ? 'text-primary font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Components
            </Link>
          </div>
          
          {/* Desktop CTA Button */}
          <div className="hidden sm:block">
            <Button asChild size="sm" className="text-sm sm:text-base px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl">
              <Link href="/sign-in">
                Login
                <div className="ml-2 sm:ml-3 w-4 h-4 sm:w-6 sm:h-6 bg-foreground/10 rounded-md flex items-center justify-center">
                  <ArrowRight className="h-2 w-2 sm:h-3 sm:w-3" />
                </div>
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="sm:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
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
                className={`text-sm transition-colors duration-200 py-2 ${
                  currentPage === 'components' 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Components
              </Link>
              <div className="pt-2">
                <Button asChild size="sm" className="w-full text-sm px-4 py-2 rounded-xl">
                  <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                    <div className="ml-2 w-4 h-4 bg-foreground/10 rounded-md flex items-center justify-center">
                      <ArrowRight className="h-2 w-2" />
                    </div>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
