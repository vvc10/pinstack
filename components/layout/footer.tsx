"use client"

import Link from "next/link"

interface FooterProps {
  currentPage?: 'landing' | 'about' | 'components'
}

export function Footer({ currentPage }: FooterProps) {
  return (
    <footer className="relative border-t bg-background/50">
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary font-bold rounded-lg flex items-center justify-center">
                P.
              </div>
              <span className="font-semibold text-lg">pinstack</span>
            </div>
            
            {/* Legal Links */}
            <div className="flex items-center gap-6 mb-4 md:mb-0">
              <Link 
                href="/about" 
                className={`text-sm transition-colors duration-200 ${
                  currentPage === 'about' 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                About
              </Link>
              <a 
                href="/terms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a 
                href="/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Privacy Policy
              </a>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2026 pinstack. Built for developers, by <a href="https://x.com/pankajstwt" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">developer</a>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
