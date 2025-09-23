"use client"

import { useEffect } from 'react'

export default function AboutPage() {
  // Force dark mode for about page
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8">
            About pinstack
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
              We help developers <span className="text-primary">ship beautiful UIs faster</span> by providing 
              <span className="text-primary"> production-ready code</span> for stunning designs. 
              <span className="text-primary"> No more recreating from scratch.</span>
            </p>
            
            <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
              Every developer knows the struggle: you find beautiful UI designs on Pinterest, 
              Dribbble, or Behance, but <span className="text-primary">you can't actually use them</span>. 
              You spend hours recreating them from scratch, or worse, settle for mediocre designs.
            </p>
            
            <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
              <span className="text-primary">We believe your product deserves to look beautiful too.</span> 
              That's why we created pinstack – a platform where beautiful designs meet production-ready code.
            </p>
            
            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Our Mission</h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
              To <span className="text-primary">democratize beautiful UI design</span> by making it 
              <span className="text-primary"> accessible to every developer</span>, 
              regardless of their design skills or budget.
            </p>
            
            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">What We Offer</h2>
            <ul className="list-disc list-inside text-base sm:text-lg text-muted-foreground space-y-1 sm:space-y-2">
              <li><span className="text-primary">Production-ready code in seconds, not hours</span></li>
              <li>Every component tested and optimized for real projects</li>
              <li>Built by developers, for developers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
