"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function CreatePinPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Create a new Pin</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g., Responsive CSS Grid Cheat Sheet" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Thumbnail URL</Label>
            <Input id="image" type="url" placeholder="https://..." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" placeholder="What makes this pin valuable?" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" placeholder="javascript, css, react" />
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-end gap-2">
          <Button variant="secondary">Cancel</Button>
          <Button>Create</Button>
        </CardFooter>
      </Card>
    </main>
  )
}
