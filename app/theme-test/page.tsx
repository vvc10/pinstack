"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ThemeTest() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Theme Test Page</h1>
          <p className="text-muted-foreground">Testing the new Indigo minimal theme</p>
        </div>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>Primary: Indigo (#4C51BF), Secondary: Soft Gray (#F5F5F5)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-medium">Primary</span>
                </div>
                <p className="text-sm text-muted-foreground">#4C51BF</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-secondary rounded-lg flex items-center justify-center">
                  <span className="text-secondary-foreground font-medium">Secondary</span>
                </div>
                <p className="text-sm text-muted-foreground">#F5F5F5</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground font-medium">Muted</span>
                </div>
                <p className="text-sm text-muted-foreground">Soft Gray</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-background border border-border rounded-lg flex items-center justify-center">
                  <span className="text-foreground font-medium">Background</span>
                </div>
                <p className="text-sm text-muted-foreground">White/Dark</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Components */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Enter text..." />
              <Textarea placeholder="Enter description..." />
              <div className="flex gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dark Mode Test */}
        <Card>
          <CardHeader>
            <CardTitle>Dark/Light Mode</CardTitle>
            <CardDescription>Toggle between dark and light mode to see theme consistency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-foreground">This card uses the muted background color which adapts to the theme.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
