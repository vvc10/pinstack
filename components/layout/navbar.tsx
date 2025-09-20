"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface NavbarProps {
  currentPage?: 'landing' | 'about' | 'components'
}

export function Navbar({ currentPage }: NavbarProps) {
  return (
    <header className="w-full md:w-[60%] sticky top-6 z-50 my-6 mx-auto border-b bg-zinc-800/50 backdrop-blur rounded-2xl">
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary font-bold rounded-lg flex items-center justify-center">
            P.
          </div>
          <span className="text-xl font-bold">pinstack</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <a 
            href="/#features" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Features
          </a>
          <a 
            href="/#how-it-works" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            How it Works
          </a>
          <Link 
            href="/components" 
            className={`text-sm transition-colors duration-200 ${
              currentPage === 'components' 
                ? 'text-primary font-medium' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Components
          </Link>
        </div>
        
        <Button asChild size="lg" className="text-lg px-6 py-3 rounded-xl">
          <Link href="/sign-in">
            Login
            <div className="ml-3 w-6 h-6 bg-foreground/10 rounded-md flex items-center justify-center">
              <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        </Button>
      </div>
    </header>
  )
}
