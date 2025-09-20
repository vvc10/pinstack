"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Chrome, Code, Users, Zap, ArrowRight, Copy } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useEffect, useRef } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { CTACard } from "@/components/layout/cta-card"

export default function LandingPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("Please login to copy actual code");
    toast.success("Copied to clipboard!");
  };

  // Auto scroll functionality with seamless loop
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollSpeed = 0.8; // pixels per frame
    let isScrolling = true;
    let animationId: number;

    const scroll = () => {
      if (isScrolling && scrollContainer) {
        scrollContainer.scrollTop += scrollSpeed;

        // Check if we've reached the bottom
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;

        if (scrollContainer.scrollTop >= maxScroll - 10) { // Small buffer for smooth transition
          // Reset to top for seamless infinite loop
          scrollContainer.scrollTop = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    // Start scrolling after a short delay
    const startScrolling = () => {
      animationId = requestAnimationFrame(scroll);
    };

    // Start scrolling after component mounts
    const timeoutId = setTimeout(startScrolling, 1000);

    // Pause on hover
    const handleMouseEnter = () => {
      isScrolling = false;
    };
    const handleMouseLeave = () => {
      isScrolling = true;
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar currentPage="landing" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with animated gradient */}
        <div className="absolute inset-0 ">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        </div>

        {/* Floating background elements */}


        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-left space-y-8">
                {/* Pre-heading */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Join 200+ developers shipping faster</span>
                  <Link href="/components" className="text-primary hover:underline flex items-center gap-1">
                    View more
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

                {/* Description with USP */}
                <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                  Stop scrolling hours on pinterest for UI design inspiration. No more eye candy UIs on Pinterest. 
                  <span className="text-primary font-semibold"> Get instant code, use it, ship it.</span> Browse our curated collection of stunning components and ship your next project in record time.
                </p>

                {/* CTA Button */}
                <Button size="lg" asChild className="text-lg px-8 py-6 rounded-xl">
                  <Link href="/sign-in">
                    <Chrome className="mr-3 h-5 w-5" />
                    Get Started 
                    <div className="ml-3 w-6 h-6 bg-foreground/10 rounded-md flex items-center justify-center">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                </Button>
              </div>

              {/* Right Content - Vertical Infinite Scroll */}
              <div className="relative h-[600px] w-full max-w-md">
                {/* Top Blur Gradient */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
                
                {/* Bottom Blur Gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
                
                {/* Vertical Scroll Container */}
                <div
                  ref={scrollContainerRef}
                  className="h-full w-full overflow-y-auto scrollbar-hide"
                >
                  <div className="space-y-4 p-4">
                    {/* Scrollable Image Items - Original Sizes */}
                    <div className="w-full rounded-lg overflow-hidden bg-gray-100 relative group">
                      <img
                        src="/assets/landing/image.png"
                        alt="UI Component"
                        className="w-full h-auto object-contain"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={handleCopyCode}
                          className="bg-white/95 hover:bg-white text-black font-medium px-2 py-1 rounded-md shadow-lg text-xs h-6 w-16 flex items-center justify-center gap-1 hover:scale-105 transition-transform duration-200"
                        >
                          <Copy className="h-2 w-2" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="w-full rounded-lg overflow-hidden bg-gray-100 relative group">
                      <img
                        src="/assets/landing/image2.png"
                        alt="Dashboard UI"
                        className="w-full h-auto object-contain"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={handleCopyCode}
                          className="bg-white/95 hover:bg-white text-black font-medium px-2 py-1 rounded-md shadow-lg text-xs h-6 w-16 flex items-center justify-center gap-1 hover:scale-105 transition-transform duration-200"
                        >
                          <Copy className="h-2 w-2" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="w-full rounded-lg overflow-hidden bg-gray-100 relative group">
                      <img
                        src="/assets/landing/image3.png"
                        alt="Code Editor"
                        className="w-full h-auto object-contain"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={handleCopyCode}
                          className="bg-white/95 hover:bg-white text-black font-medium px-2 py-1 rounded-md shadow-lg text-xs h-6 w-16 flex items-center justify-center gap-1 hover:scale-105 transition-transform duration-200"
                        >
                          <Copy className="h-2 w-2" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="w-full rounded-lg overflow-hidden bg-gray-100 relative group">
                      <img
                        src="/assets/landing/image4.png"
                        alt="Dashboard UI"
                        className="w-full h-auto object-contain"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={handleCopyCode}
                          className="bg-white/95 hover:bg-white text-black font-medium px-2 py-1 rounded-md shadow-lg text-xs h-6 w-16 flex items-center justify-center gap-1 hover:scale-105 transition-transform duration-200"
                        >
                          <Copy className="h-2 w-2" />
                          Copy
                        </Button>
                      </div>
                    </div>
                    <div className="w-full rounded-lg overflow-hidden bg-gray-100 relative group">
                      <img
                        src="/assets/landing/image5.png"
                        alt="Dashboard UI"
                        className="w-full h-auto object-contain"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={handleCopyCode}
                          className="bg-white/95 hover:bg-white text-black font-medium px-2 py-1 rounded-md shadow-lg text-xs h-6 w-16 flex items-center justify-center gap-1 hover:scale-105 transition-transform duration-200"
                        >
                          <Copy className="h-2 w-2" />
                          Copy
                        </Button>
                      </div>
                    </div>

                  </div>
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
              <Card className="rounded-2xl border-0">
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

              <Card className="rounded-2xl border-0">
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

              <Card className="rounded-2xl border-0">
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

      {/* How it Works Section */}
      <section id="how-it-works" className="relative py-20 flex items-center justify-center overflow-hidden">
        {/* Background with animated gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto">
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 flex items-center justify-center overflow-hidden">
        {/* Background with animated gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <CTACard 
              title="Get your perfect UI components today"
              description="Copy, paste, tweak, and ship. Beautiful UI components ready to use in your projects."
              buttonText="Start Creating"
              buttonHref="/sign-in"
              showImages={true}
            />
          </div>
        </div>
      </section>

      <Footer currentPage="landing" />
    </div>
  )
}
