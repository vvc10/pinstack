"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Chrome, Code, Users, ArrowRight, Copy, Rocket, Shield } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useEffect, useRef } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { CTACard } from "@/components/layout/cta-card"

export default function LandingPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Force dark mode for landing page
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("Please login to copy actual code");
    toast.success("Copied to clipboard!");
  };

  // Auto scroll functionality with seamless horizontal loop
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollSpeed = 0.5; // pixels per frame (slower for horizontal)
    let isScrolling = true;
    let animationId: number;

    const scroll = () => {
      if (isScrolling && scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;

        // Check if we've reached the right edge
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;

        if (scrollContainer.scrollLeft >= maxScroll - 10) { // Small buffer for smooth transition
          // Reset to left for seamless infinite loop
          scrollContainer.scrollLeft = 0;
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20" data-theme="dark">
      <Navbar currentPage="landing" />

      {/* Hero Section */}
      <section className="relative w-full mx-auto max-w-6xl border border-zinc-800 rounded-2xl sm:rounded-3xl min-h-screen flex items-center justify-center overflow-hidden mt-2 md:mt-6 pt-2 sm:pt-4 md:pt-28 px-2 sm:px-4">
        {/* Background with animated gradient */}
        <div className="absolute inset-0 ">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 w-full mx-auto px-4 py-12 sm:px-6">
          <div className="flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8">
              {/* Content */}
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {/* Pre-heading */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm text-muted-foreground justify-center">
                  <span>Join 200+ developers shipping faster</span>
                  <Link href="/components" className="text-primary hover:underline flex items-center gap-1 justify-center">
                    View more
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                {/* Main Heading */}
                <h1 className="font-garamond text-3xl flex flex-col sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal leading-tight sm:leading-[3rem] md:leading-[4rem] lg:leading-[5rem] xl:leading-[6rem]">
                  Beautiful UIs.
                  <span className="font-instrument font-normal text-7xl md:4xl text-primary italic">Ready to copy.</span>
                </h1>

                {/* Description with USP */}
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mx-auto text-center max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
                  Stop scrolling hours on pinterest for UI design inspiration. No more eye candy UIs on Pinterest. 
                  Get instant code, use it, ship it. Browse our curated collection of stunning components and ship your next project in record time.
                </p>
               
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto mx-auto justify-center">
                  <Button size="lg" asChild className="text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 rounded-xl w-full sm:w-auto">
                    <Link href="/sign-in">
                      <Chrome className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                      Get Started 
                      <div className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-foreground/10 rounded-md flex items-center justify-center">
                        <ArrowRight className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3" />
                      </div>
                    </Link>
                  </Button>
                  
                  <Button size="lg" variant="outline" asChild className="text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 rounded-xl w-full sm:w-auto">
                    <Link href="/components">
                      <Code className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                      Explore
                    </Link>
                  </Button>
                </div>
                <p className="font-[400] dark:text-zinc-400 text-xs sm:text-sm mx-auto">
                  Skip the design phase. Get production-ready code in seconds.
                </p>
                
               
              </div>

              {/* Horizontal Scroll Section */}
              <div className="w-full mt-8 sm:mt-12 md:mt-16 lg:mt-20">
                <div className="relative">
                  {/* Left Blur Gradient */}
                  <div className="absolute left-0 top-0 bottom-0 w-4 sm:w-6 md:w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

                  {/* Right Blur Gradient */}
                  <div className="absolute right-0 top-0 bottom-0 w-4 sm:w-6 md:w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                  {/* Horizontal Scroll Container */}
                <div
                  ref={scrollContainerRef}
                    className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-2 sm:pb-3 md:pb-4"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {/* Scrollable Image Items */}
                    <div className="flex-shrink-0 w-64 h-40 sm:w-80 sm:h-52 md:w-96 md:h-64 rounded-lg overflow-hidden bg-gray-100 relative group">
                      <img
                        src="/assets/landing/image.png"
                        alt="UI Component"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={handleCopyCode}
                          className="bg-white/95 hover:bg-white text-black font-medium px-2 py-1 rounded-md shadow-lg text-xs h-5 sm:h-6 w-12 sm:w-16 flex items-center justify-center gap-1 hover:scale-105 transition-transform duration-200"
                        >
                          <Copy className="h-2 w-2" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="flex-shrink-0 w-64 h-40 sm:w-80 sm:h-52 md:w-96 md:h-64 rounded-lg overflow-hidden bg-gray-100 relative group">
                      <img
                        src="/assets/landing/image2.png"
                        alt="Dashboard UI"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={handleCopyCode}
                          className="bg-white/95 hover:bg-white text-black font-medium px-2 py-1 rounded-md shadow-lg text-xs h-5 sm:h-6 w-12 sm:w-16 flex items-center justify-center gap-1 hover:scale-105 transition-transform duration-200"
                        >
                          <Copy className="h-2 w-2" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="flex-shrink-0 w-64 h-40 sm:w-80 sm:h-52 md:w-96 md:h-64 rounded-lg overflow-hidden bg-gray-100 relative group">
                      <img
                        src="/assets/landing/image3.png"
                        alt="Code Editor"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={handleCopyCode}
                          className="bg-white/95 hover:bg-white text-black font-medium px-2 py-1 rounded-md shadow-lg text-xs h-5 sm:h-6 w-12 sm:w-16 flex items-center justify-center gap-1 hover:scale-105 transition-transform duration-200"
                        >
                          <Copy className="h-2 w-2" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="flex-shrink-0 w-64 h-40 sm:w-80 sm:h-52 md:w-96 md:h-64 rounded-lg overflow-hidden bg-gray-100 relative group">
                      <img
                        src="/assets/landing/image4.png"
                        alt="Dashboard UI"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={handleCopyCode}
                          className="bg-white/95 hover:bg-white text-black font-medium px-2 py-1 rounded-md shadow-lg text-xs h-5 sm:h-6 w-12 sm:w-16 flex items-center justify-center gap-1 hover:scale-105 transition-transform duration-200"
                        >
                          <Copy className="h-2 w-2" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="flex-shrink-0 w-64 h-40 sm:w-80 sm:h-52 md:w-96 md:h-64 rounded-lg overflow-hidden bg-gray-100 relative group">
                      <img
                        src="/assets/landing/image5.png"
                        alt="Dashboard UI"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={handleCopyCode}
                          className="bg-white/95 hover:bg-white text-black font-medium px-2 py-1 rounded-md shadow-lg text-xs h-5 sm:h-6 w-12 sm:w-16 flex items-center justify-center gap-1 hover:scale-105 transition-transform duration-200"
                        >
                          <Copy className="h-2 w-2" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    {/* Duplicate items for infinite scroll effect */}
                    <div className="flex-shrink-0 w-64 h-40 sm:w-80 sm:h-52 md:w-96 md:h-64 rounded-lg overflow-hidden bg-gray-100 relative group">
                      <img
                        src="/assets/landing/image.png"
                        alt="UI Component"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={handleCopyCode}
                          className="bg-white/95 hover:bg-white text-black font-medium px-2 py-1 rounded-md shadow-lg text-xs h-5 sm:h-6 w-12 sm:w-16 flex items-center justify-center gap-1 hover:scale-105 transition-transform duration-200"
                        >
                          <Copy className="h-2 w-2" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="flex-shrink-0 w-64 h-40 sm:w-80 sm:h-52 md:w-96 md:h-64 rounded-lg overflow-hidden bg-gray-100 relative group">
                      <img
                        src="/assets/landing/image2.png"
                        alt="Dashboard UI"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={handleCopyCode}
                          className="bg-white/95 hover:bg-white text-black font-medium px-2 py-1 rounded-md shadow-lg text-xs h-5 sm:h-6 w-12 sm:w-16 flex items-center justify-center gap-1 hover:scale-105 transition-transform duration-200"
                        >
                          <Copy className="h-2 w-2" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="flex-shrink-0 w-64 h-40 sm:w-80 sm:h-52 md:w-96 md:h-64 rounded-lg overflow-hidden bg-gray-100 relative group">
                      <img
                        src="/assets/landing/image3.png"
                        alt="Code Editor"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={handleCopyCode}
                          className="bg-white/95 hover:bg-white text-black font-medium px-2 py-1 rounded-md shadow-lg text-xs h-5 sm:h-6 w-12 sm:w-16 flex items-center justify-center gap-1 hover:scale-105 transition-transform duration-200"
                        >
                          <Copy className="h-2 w-2" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="flex-shrink-0 w-64 h-40 sm:w-80 sm:h-52 md:w-96 md:h-64 rounded-lg overflow-hidden bg-gray-100 relative group">
                      <img
                        src="/assets/landing/image4.png"
                        alt="Dashboard UI"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={handleCopyCode}
                          className="bg-white/95 hover:bg-white text-black font-medium px-2 py-1 rounded-md shadow-lg text-xs h-5 sm:h-6 w-12 sm:w-16 flex items-center justify-center gap-1 hover:scale-105 transition-transform duration-200"
                        >
                          <Copy className="h-2 w-2" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="flex-shrink-0 w-64 h-40 sm:w-80 sm:h-52 md:w-96 md:h-64 rounded-lg overflow-hidden bg-gray-100 relative group">
                      <img
                        src="/assets/landing/image5.png"
                        alt="Dashboard UI"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={handleCopyCode}
                          className="bg-white/95 hover:bg-white text-black font-medium px-2 py-1 rounded-md shadow-lg text-xs h-5 sm:h-6 w-12 sm:w-16 flex items-center justify-center gap-1 hover:scale-105 transition-transform duration-200"
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
      </section>

      {/* Features Section */}
      <section id="features" className="relative w-full mx-auto max-w-6xl border border-zinc-800 rounded-2xl sm:rounded-3xl flex items-center justify-center overflow-hidden mt-4 md:mt-6 pt-2 sm:pt-4 md:pt-2 px-2 sm:px-4">
        {/* Background with animated gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="font-garamond flex flex-row gap-2 items-center justify-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal mb-3 sm:mb-4">
                Everything you need to 
                
                <p className="font-instrument font-normal text-4xl md:4xl text-primary italic">Ship faster</p>
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
                From discovery to deployment, pinstack provides all the tools
                developers need to build and ship amazing projects.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <Card className="rounded-2xl border-0">
                <CardHeader className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                    <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">Discover & Ship Fast</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Browse hundreds of components, copy the code instantly, and ship
                    your projects in minutes. No more waiting or complex setup.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="rounded-2xl border-0">
                <CardHeader className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">Create Collections</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Organize your favorite code snippets into boards and
                    share them with your team or the community.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="rounded-2xl border-0">
                <CardHeader className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">Production Ready</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    All components are tested, optimized, and ready for production.
                    No bugs, no surprises, just reliable code that works.
                  </CardDescription>
                </CardHeader>
              </Card>

            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="relative w-full mx-auto max-w-6xl border border-zinc-800 rounded-2xl sm:rounded-3xl  flex items-center justify-center overflow-hidden mt-4 md:mt-6 pt-2 sm:pt-4 md:pt-2 px-2 sm:px-4">
        {/* Background with animated gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="font-garamond flex flex-row gap-2 items-center justify-center text-2xl sm:text-3xl md:text-4xl font-normal mb-3 sm:mb-4">
                How it
                <p className="font-instrument font-normal text-4xl md:4xl text-primary italic">Works</p>

              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
                Get beautiful UI components in your project in just a few simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <Card className="rounded-2xl border-0">
                <CardHeader className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-primary">1</span>
                  </div>
                  <CardTitle className="text-lg sm:text-xl">Browse & Discover</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Explore our curated collection of beautiful UI components. 
                    Find exactly what you need for your project.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="rounded-2xl border-0">
                <CardHeader className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-primary">2</span>
                  </div>
                  <CardTitle className="text-lg sm:text-xl">Copy & Paste</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Click to copy the code instantly. Paste it directly into 
                    your project and start customizing.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="rounded-2xl border-0">
                <CardHeader className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-primary">3</span>
                  </div>
                  <CardTitle className="text-lg sm:text-xl">Customize & Ship</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
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
      <section id="cta" className="relative w-full mx-auto max-w-6xl border border-zinc-800 rounded-2xl sm:rounded-3xl flex items-center justify-center overflow-hidden mt-4 md:mt-6">
        {/* Background with animated gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto">
          <div className="max-w-6xl mx-auto">
            <CTACard 
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
