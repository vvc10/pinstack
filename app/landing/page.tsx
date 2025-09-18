"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Chrome, Code, Users, Zap, ArrowRight, Copy } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function LandingPage() {
  const handleCopyCode = () => {
    navigator.clipboard.writeText("Please login to copy actual code");
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="w-[60%] sticky top-6 z-50 my-6 mx-auto border-b bg-zinc-800/50 backdrop-blur rounded-2xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary font-bold rounded-lg flex items-center justify-center">
              P.
            </div>
            <span className="text-xl font-bold">pinstack</span>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 rounded-xl">
             <Link href="/sign-in">
               Get Started
             </Link>
           </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with animated gradient */}
        <div className="absolute inset-0 ">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        </div>

        {/* Floating background elements */}
        

        <div className="relative z-10 container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-left space-y-8">
                {/* Pre-heading */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Join 200+ developers shipping faster</span>
                  <Link href="#features" className="text-primary hover:underline flex items-center gap-1">
                    View examples
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  Beautiful UIs.
                  <span className="text-primary block">Ready to copy.</span>
        </h1>

                {/* Sub-heading */}
                <p className="text-xl text-muted-foreground">
                  Skip the design phase. Get production-ready code in seconds.
                </p>

                {/* Description */}
                <p className="text-lg text-muted-foreground max-w-lg">
                  Stop wasting hours on UI design. Browse our curated collection of
                  stunning components, copy the code, and ship your next project in record time.
                </p>

                {/* CTA Button */}
                <Button size="lg" asChild className="text-lg px-8 py-6 rounded-xl">
             <Link href="/sign-in">
                    <Chrome className="mr-3 h-5 w-5" />
                    Start today!
                    <div className="ml-3 w-6 h-6 bg-foreground/10 rounded-md flex items-center justify-center">
                      <ArrowRight className="h-3 w-3" />
                    </div>
             </Link>
           </Button>
              </div>

              {/* Right Content - Interactive Images */}
              <div className="relative">
                <div className="relative flex items-center justify-center h-80">
                  {/* Image 1 - Left */}
                  <div 
                    className="absolute -left-8 top-8 transform -rotate-12 z-10 cursor-grab active:cursor-grabbing transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:rotate-0 hover:z-30"
                    draggable="true"
                    onDragStart={(e) => {
                      e.currentTarget.style.transform = 'rotate(0deg) scale(1.1)';
                      e.currentTarget.style.zIndex = '50';
                      e.currentTarget.style.cursor = 'grabbing';
                    }}
                    onDragEnd={(e) => {
                      e.currentTarget.style.transform = '-rotate-12 scale(1)';
                      e.currentTarget.style.zIndex = '10';
                      e.currentTarget.style.cursor = 'grab';
                    }}
                  >
                    <div className="w-72 h-44 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-white/20 backdrop-blur-sm relative group">
                      <img 
                        src="/assets/landing/image.png" 
                        alt="Pinstack UI Component" 
                        className="w-full h-full object-cover"
                      />
                      {/* Copy Code Button */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={handleCopyCode}
                          className="bg-white/95 hover:bg-white text-black font-medium px-2 py-1 rounded-xl shadow-lg text-xs h-6 w-16 flex items-center justify-center gap-1 hover:scale-105 transition-transform duration-200"
                        >
                          <Copy className="h-2.5 w-2.5" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Image 2 - Center */}
                  <div 
                    className="relative z-20 cursor-grab active:cursor-grabbing transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:z-30"
                    draggable="true"
                    onDragStart={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.zIndex = '50';
                      e.currentTarget.style.cursor = 'grabbing';
                    }}
                    onDragEnd={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.zIndex = '20';
                      e.currentTarget.style.cursor = 'grab';
                    }}
                  >
                    <div className="w-72 h-44 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-white/20 backdrop-blur-sm relative group">
                      <img 
                        src="/assets/landing/image2.png" 
                        alt="Pinstack Dashboard" 
                        className="w-full h-full object-cover"
                      />
                      {/* Copy Code Button */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={handleCopyCode}
                          className="bg-white/95 hover:bg-white text-black font-medium px-2 py-1 rounded-xl shadow-lg text-xs h-6 w-16 flex items-center justify-center gap-1 hover:scale-105 transition-transform duration-200"
                        >
                          <Copy className="h-2.5 w-2.5" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Image 3 - Right */}
                  <div 
                    className="absolute -right-8 top-8 transform rotate-12 z-10 cursor-grab active:cursor-grabbing transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:rotate-0 hover:z-30"
                    draggable="true"
                    onDragStart={(e) => {
                      e.currentTarget.style.transform = 'rotate(0deg) scale(1.1)';
                      e.currentTarget.style.zIndex = '50';
                      e.currentTarget.style.cursor = 'grabbing';
                    }}
                    onDragEnd={(e) => {
                      e.currentTarget.style.transform = 'rotate(12deg) scale(1)';
                      e.currentTarget.style.zIndex = '10';
                      e.currentTarget.style.cursor = 'grab';
                    }}
                  >
                    <div className="w-72 h-44 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-white/20 backdrop-blur-sm relative group">
                      <img 
                        src="/assets/landing/image3.png" 
                        alt="Pinstack Code Editor" 
                        className="w-full h-full object-cover"
                      />
                      {/* Copy Code Button */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={handleCopyCode}
                          className="bg-white/95 hover:bg-white text-black font-medium px-2 py-1 rounded-xl shadow-lg text-xs h-6 w-16 flex items-center justify-center gap-1 hover:scale-105 transition-transform duration-200"
                        >
                          <Copy className="h-2.5 w-2.5" />
                          Copy
          </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Drag instruction */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground/60 text-center">
                  Drag images to explore • Hover for details
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 flex items-center justify-center overflow-hidden">
        {/* Background with animated gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to organize code
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From discovery to collaboration, pinstack provides all the tools 
            developers need to build amazing projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Discover Code</CardTitle>
              <CardDescription className="text-base">
                Browse hundreds of code snippets, components, and solutions 
                from the developer community.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Create Collections</CardTitle>
              <CardDescription className="text-base">
                Organize your favorite code snippets into boards and 
                share them with your team or the community.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Stay Updated</CardTitle>
              <CardDescription className="text-base">
                Follow trending topics, get notified about new releases, 
                and never miss the latest in web development.
              </CardDescription>
            </CardHeader>
          </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 flex items-center justify-center overflow-hidden">
        {/* Background with animated gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <Card className="text-center rounded-2xl border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="p-8">
                <CardTitle className="text-3xl mb-4">Ready to get started?</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
              Join thousands of developers who are already using pinstack to 
              discover and share amazing code.
            </CardDescription>
          </CardHeader>
              <CardContent className="pb-8">
                <Button size="lg" asChild className="rounded-xl px-8 py-6 text-lg">
               <Link href="/sign-in">
                 <Chrome className="mr-2 h-5 w-5" />
                 Continue with Google
                 <ArrowRight className="ml-2 h-4 w-4" />
               </Link>
             </Button>
           </CardContent>
        </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t bg-background/50">
        <div className="relative z-10 container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
                <div className="w-6 h-6 bg-primary font-bold rounded-lg flex items-center justify-center">
P.              </div>
                <span className="font-semibold text-lg">pinstack</span>
            </div>
            <p className="text-sm text-muted-foreground">
               © 2026 pinstack. Built for developers, by <a href="https://x.com/pankajstwt" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">developer</a>.
            </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
