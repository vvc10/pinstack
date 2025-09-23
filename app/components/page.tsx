"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { MasonryPinterest } from "@/components/masonry-pinterest"
import { ComponentCard } from "@/components/component-card"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { CTACard } from "@/components/layout/cta-card"

export default function ComponentsPage() {
  // Force dark mode for components page
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  const componentImages = [
    {
      src: "/assets/landing/image.png",
      alt: "UI Component"
    },
    {
      src: "/assets/landing/image2.png",
      alt: "Dashboard UI"
    },
    {
      src: "/assets/landing/image3.png",
      alt: "Code Editor"
    },
    {
      src: "/assets/landing/image4.png",
      alt: "Dashboard UI"
    },
    {
      src: "/assets/landing/image5.png",
      alt: "Dashboard UI"
    },
    {
      src: null,
      alt: "Coming Soon",
      isComingSoon: true
    }
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar currentPage="components" />

      {/* Main Content */}
      <section className="relative py-6 sm:py-8 flex items-center justify-center overflow-hidden">
        {/* Background with animated gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6">
                 <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-white hover:bg-transparent">
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Link>
                </Button>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                UI Components
                <span className="text-primary block">Ready to Copy</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Browse our curated collection of beautiful UI components. 
                Click to copy the code and use them in your projects.
              </p>
            </div>

            {/* Components Masonry */}
            <MasonryPinterest 
              items={componentImages} 
              renderItem={(component) => (
                <ComponentCard 
                  component={component} 
                />
              )} 
              className="mt-2" 
              gap={16}
              columns={{
                mobile: 1,
                tablet: 2,
                desktop: 3,
                xl: 4
              }}
             />

             {/* How it Works Section */}
             <div className="mt-20">
               <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-4xl font-bold mb-4">
                   How it Works
                 </h2>
                 <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                   Get beautiful UI components in your project in just a few simple steps
                 </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <Card className="rounded-2xl border-0">
                   <CardHeader className="p-6">
                     <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                       <span className="text-2xl font-bold text-primary">1</span>
                     </div>
                     <CardTitle className="text-xl">Browse & Discover</CardTitle>
                     <CardDescription className="text-base">
                       Explore our curated collection of beautiful UI components. 
                       Find exactly what you need for your project.
                     </CardDescription>
                   </CardHeader>
                 </Card>

                 <Card className="rounded-2xl border-0">
                   <CardHeader className="p-6">
                     <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                       <span className="text-2xl font-bold text-primary">2</span>
                     </div>
                     <CardTitle className="text-xl">Copy & Paste</CardTitle>
                     <CardDescription className="text-base">
                       Click to copy the code instantly. Paste it directly into 
                       your project and start customizing.
                     </CardDescription>
                   </CardHeader>
                 </Card>

                 <Card className="rounded-2xl border-0">
                   <CardHeader className="p-6">
                     <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                       <span className="text-2xl font-bold text-primary">3</span>
                     </div>
                     <CardTitle className="text-xl">Customize & Ship</CardTitle>
                     <CardDescription className="text-base">
                       Tweak the components to match your design system. 
                       Test, iterate, and ship your project faster.
                     </CardDescription>
                   </CardHeader>
                 </Card>
               </div>
             </div>

             {/* CTA Section */}
            <div className="mt-16">
              <CTACard 
                title="Get your perfect UI components today"
                description="Copy, paste, tweak, and ship. Beautiful UI components ready to use in your projects."
                buttonText="Start Creating"
                buttonHref="/sign-in"
                showImages={true}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer currentPage="components" />
    </div>
  )
}
