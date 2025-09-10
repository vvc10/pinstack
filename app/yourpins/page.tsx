"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PinCard } from "@/components/pin/pin-card"
import { AppLayout } from "@/components/layout/app-layout"
import { useAuth } from "@/contexts/auth-context"
import { Clock, CheckCircle, XCircle, Edit, Bookmark, User } from "lucide-react"
import type { Pin } from "@/types/pin"

interface SavedPin extends Pin {
  board_name?: string
  board_id?: string
  saved_at?: string
}

export default function YourPinsPage() {
  const [createdPins, setCreatedPins] = useState<Pin[]>([])
  const [savedPins, setSavedPins] = useState<SavedPin[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("created")
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchCreatedPins()
      fetchSavedPins()
    }
  }, [user])

  const fetchCreatedPins = async () => {
    try {
      const response = await fetch('/api/pins/my-pins?status=all')
      const data = await response.json()
      setCreatedPins(data.items || [])
    } catch (error) {
      console.error('Error fetching created pins:', error)
    }
  }

  const fetchSavedPins = async () => {
    try {
      const response = await fetch('/api/pins/saved-pins')
      const data = await response.json()
      setSavedPins(data.items || [])
    } catch (error) {
      console.error('Error fetching saved pins:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3" />
      case 'published':
        return <CheckCircle className="w-3 h-3" />
      case 'archived':
        return <XCircle className="w-3 h-3" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  if (loading) {
    return (
      <AppLayout currentTab="yourpins">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-muted rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout currentTab="yourpins">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Pins</h1>
          <p className="text-muted-foreground">
            Manage your created pins and view your saved collection
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="created" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Created by you ({createdPins.length})
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Saved pins ({savedPins.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="created" className="space-y-6">
            {createdPins.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No pins created yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start creating amazing code snippets and share them with the community
                </p>
                <Button asChild>
                  <a href="/create-pin">Create your first pin</a>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {createdPins.map((pin) => (
                  <div key={pin.id} className="relative">
                    <PinCard pin={pin} />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(pin.status || 'draft')}`}
                      >
                        {getStatusIcon(pin.status || 'draft')}
                        {pin.status === 'pending' ? 'Pending' : 
                         pin.status === 'published' ? 'Published' : 
                         pin.status === 'archived' ? 'Archived' : 'Draft'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            {savedPins.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No saved pins yet</h3>
                <p className="text-muted-foreground mb-4">
                  Save pins you love to your boards for easy access later
                </p>
                <Button asChild>
                  <a href="/">Explore pins</a>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {savedPins.map((pin) => (
                  <div key={`${pin.id}-${pin.board_id}`} className="relative">
                    <PinCard pin={pin} />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <Badge 
                        variant="secondary" 
                        className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                      >
                        <Bookmark className="w-3 h-3 mr-1" />
                        {pin.board_name || 'Saved'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
