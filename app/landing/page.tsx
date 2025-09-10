"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Chrome, Code, Users, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Code className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">pinstack</span>
          </div>
                     <Button asChild>
             <Link href="/sign-in">
               <Chrome className="mr-2 h-4 w-4" />
               Get Started
             </Link>
           </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <Badge variant="secondary" className="mb-4">
          Pinterest for Developers
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Discover, Curate & Share
          <span className="text-primary"> Code Ideas</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          The ultimate platform for developers to discover amazing code snippets, 
          create collections, and collaborate with the community.
        </p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <Button size="lg" asChild>
             <Link href="/sign-in">
               <Chrome className="mr-2 h-5 w-5" />
               Continue with Google
               <ArrowRight className="ml-2 h-4 w-4" />
             </Link>
           </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">
              Learn More
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
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
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Discover Code</CardTitle>
              <CardDescription>
                Browse thousands of code snippets, components, and solutions 
                from the developer community.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Create Collections</CardTitle>
              <CardDescription>
                Organize your favorite code snippets into boards and 
                share them with your team or the community.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Stay Updated</CardTitle>
              <CardDescription>
                Follow trending topics, get notified about new releases, 
                and never miss the latest in web development.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Ready to get started?</CardTitle>
            <CardDescription className="text-lg">
              Join thousands of developers who are already using pinstack to 
              discover and share amazing code.
            </CardDescription>
          </CardHeader>
                     <CardContent>
             <Button size="lg" asChild>
               <Link href="/sign-in">
                 <Chrome className="mr-2 h-5 w-5" />
                 Continue with Google
                 <ArrowRight className="ml-2 h-4 w-4" />
               </Link>
             </Button>
           </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Code className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">pinstack</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 pinstack. Built for developers, by developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
