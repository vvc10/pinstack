"use client"

import { useEffect, useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditsBadge } from "@/components/ui/credits-badge"
import { Copy, Check, Pen, ChevronDown, ChevronUp, Figma, Loader2, BlocksIcon } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark"
import MonacoClient from "@/components/playground/monaco-client"
import { JSRunner } from "@/components/playground/js-runner"
import { IntegrationButtons } from "@/components/integrations/integration-buttons"
import { CustomTooltip } from "@/components/ui/custom-tooltip"
import { RelatedPins } from "@/components/pin/related-pins"
import { ShareMenu } from "@/components/pin/share-menu"
import { EditPinModal } from "@/components/pin/edit-pin-modal"
import { PreviewModal } from "@/components/pin/preview-modal"
import { SelectBoardDialog } from "@/components/board/select-board-dialog"
import type { Pin } from "@/types/pin"
import { AppLayout } from "@/components/layout/app-layout"
import { useRealtimeVotes } from "@/hooks/use-realtime-votes"
import { useAuth } from "@/contexts/auth-context"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useSavedPins } from "@/hooks/use-saved-pins"
import { Edit, ArrowLeft, Heart, MessageCircle, Share2, Bookmark, ExternalLink, MoreHorizontal } from "lucide-react"

export default function PinDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [pin, setPin] = useState<Pin | null>(null)
  const [author, setAuthor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("code")
  const [editable, setEditable] = useState("")
  const [runnerCode, setRunnerCode] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [boardModalOpen, setBoardModalOpen] = useState(false)

  // Real-time votes for this pin
  const { voteCount: realtimeVoteCount, isLiked, isConnected, currentUserId, broadcastVote } = useRealtimeVotes(id)

  // Auth context
  const { user } = useAuth()

  // Saved pins hook
  const { isPinSaved, addToSaved, removeFromSaved } = useSavedPins()
  const isSaved = isPinSaved(id)

  // Debug logging
  console.log('Pin detail state:', { realtimeVoteCount, isLiked, isConnected, currentUserId })

  useEffect(() => {
    async function fetchPin() {
      try {
        const response = await fetch(`/api/pins/${id}`)
        const data = await response.json()
        setPin(data.pin)
        setAuthor(data.author)
        setEditable(data.pin.code)

        // Pin saved state is now handled by the useSavedPins hook
      } catch (error) {
        console.error("Failed to fetch pin:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPin()
  }, [id, user])

  const handleSavePin = async () => {
    if (!user || isSaving || !pin) return

    setIsSaving(true)
    try {
      if (isSaved) {
        // Remove from saved pins (both general and board-specific)
        const response = await fetch(`/api/pins/${id}/save`, {
          method: 'DELETE'
        })

        if (response.ok) {
          removeFromSaved(id)
        }
      } else {
        // Save to general collection (not board-specific)
        const response = await fetch('/api/pins/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pinId: id })
        })

        if (response.ok) {
          addToSaved(id)
        }
      }
    } catch (error) {
      console.error('Failed to save pin:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <AppLayout currentTab="home">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-muted rounded mb-4"></div>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!pin) {
    return (
      <AppLayout currentTab="home">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Pin not found</h1>
            <p className="text-muted-foreground">The pin you're looking for doesn't exist.</p>
          </div>
        </div>
      </AppLayout>
    )
  }


  return (
    <AuthGuard>
      <AppLayout currentTab="home">
        <main className="min-h-screen bg-background">

          {/* Main Content Area */}
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Flex Layout - Left Preview (60%) & Right Sidebar (40%) */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-12">
              {/* Left Side - Preview */}
              <div className="lg:w-[60%] flex flex-col gap-4 border border-border rounded-2xl p-6">

                <div className="flex flex-row justify-between items-center gap-4">

                  <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.history.back()}
                      className="p-2 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 rounded-xl cursor-pointer"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <span>Pin</span>
                    <span>•</span>
                    <span className="font-medium text-foreground">{pin.title}</span>
                  </div>
                  {/* Save Buttons - Top Right */}
                  {user && (
                    <div className="z-10 flex items-center gap-2">
                      {/* More Options Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setBoardModalOpen(true)}
                        className="rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm cursor-pointer"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>

                      {/* Edit Button - Only show for pin owner */}
                      {user && pin.author_id === user.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            setEditOpen(true)
                          }}
                          className="flex items-center gap-2 px-4 py-4 bg-card rounded-xl cursor-pointer border border-border hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 hover:text-zinc-700 dark:text-zinc-50 transition-all duration-200 hover:scale-105"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                      )}

                      <ShareMenu
                        url={`${typeof window !== 'undefined' ? window.location.origin : ''}/pin/${id}`}
                        title={pin.title}
                      />
                      {/* Like Button */}
                      <Button
                        disabled={!currentUserId}
                        variant="outline"
                        size="sm"
                        className={`flex items-center gap-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer ${isLiked ? 'text-red-500 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800' : ''}`}
                        onClick={async (e) => {
                          e.stopPropagation()
                          e.preventDefault()

                          if (!currentUserId) return

                          // Optimistic update - immediately show the new state
                          const newIsLiked = !isLiked
                          const newCount = newIsLiked ? realtimeVoteCount + 1 : Math.max(0, realtimeVoteCount - 1)

                          // Broadcast optimistic update immediately
                          broadcastVote(newCount, newIsLiked, newIsLiked ? 'like' : 'unlike')

                          try {
                            const response = await fetch('/api/votes', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ pinId: id, userId: currentUserId })
                            })

                            if (response.ok) {
                              const data = await response.json()
                              // Broadcast the actual data from the database to sync with reality
                              broadcastVote(data.count, data.isLiked, data.isLiked ? 'like' : 'unlike')
                            } else {
                              // Revert optimistic update on error
                              broadcastVote(realtimeVoteCount, isLiked, isLiked ? 'like' : 'unlike')
                            }
                          } catch (error) {
                            console.error('Error toggling vote:', error)
                            // Revert optimistic update on error
                            broadcastVote(realtimeVoteCount, isLiked, isLiked ? 'like' : 'unlike')
                          }
                        }}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        <span className="hidden sm:inline">{realtimeVoteCount}</span>
                      </Button>

                      {/* Save Button */}
                      <Button
                        size="sm"
                        disabled={isSaving}
                        onClick={handleSavePin}
                        className={`flex items-center gap-2 rounded-xl shadow-lg transition-all duration-200 ${isSaved
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                          } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                          </>
                          // <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                        )}
                        <span className="text-sm font-medium">
                          {isSaving ? '' : isSaved ? 'Saved' : 'Save'}
                        </span>
                      </Button>
                    </div>
                  )}

                </div>


                <div className="sticky top-20 lg:top-24">
                  <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden relative">

                    <img
                      src={pin.image || "/placeholder.svg"}
                      alt={`Preview for ${pin.title}`}
                      className="w-full h-auto"
                      style={{
                        maxHeight: "80vh",
                        objectFit: "contain",
                        display: "block"
                      }}
                    />
                  </div>

                  {/* Title and Owner Info - Below Image (Pinterest Style) */}
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="text-xl font-normal text-foreground leading-tight">{pin.title}</h4>
                      {pin.credits && (
                        <CreditsBadge credits={pin.credits} />
                      )}
                    </div>

                    {/* Author Info with Profile Image */}
                    <div className="flex items-center gap-3">

                      <div className="flex flex-col">
                        <span className="text-sm dark:text-zinc-500 flex flex-row items-center gap-1 font-normal text-foreground">
                          by

                          <div className="w-4 h-4 rounded-full overflow-hidden bg-muted flex-shrink-0">
                            {author?.avatar_url ? (
                              <img
                                src={author.avatar_url}
                                alt={author.full_name || author.username || 'User'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                                <span className="text-primary font-semibold text-sm">
                                  {(author?.full_name || author?.username || 'A').charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>


                          <span className="text-sm dark:text-zinc-300 flex flex-row items-center gap-1">
                            {author?.full_name || author?.username || 'Anonymous'}</span>
                        </span>
                        {/* {author?.username && author?.full_name && (
                        <span className="text-xs text-muted-foreground">@{author.username}</span>
                      )} */}
                      </div>
                    </div>

                    {/* Expandable Description */}
                    {pin.description && (
                      <div className="mt-4">
                        <div className="text-sm text-muted-foreground leading-relaxed">
                          {isDescriptionExpanded ? (
                            <div className="space-y-2">
                              <p className="transition-all duration-300 ease-in-out">
                                {pin.description}
                              </p>
                              <button
                                onClick={() => setIsDescriptionExpanded(false)}
                                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer"
                              >
                                <ChevronUp className="h-3 w-3" />
                                Show less
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="transition-all duration-300 ease-in-out">
                                {pin.description.split(' ').slice(0, 3).join(' ')}
                                {pin.description.split(' ').length > 3 && '...'}
                              </p>
                              {pin.description.split(' ').length > 3 && (
                                <button
                                  onClick={() => setIsDescriptionExpanded(true)}
                                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer"
                                >
                                  <ChevronDown className="h-3 w-3" />
                                  more
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Tabs Sidebar */}
              <div className="lg:w-[40%] h-fit flex flex-col gap-4 border border-border rounded-2xl p-6 lg:min-w-0 lg:max-w-[40%]">

                {/* Right side - Action buttons */}
                <div className="flex items-center gap-2">




                  <IntegrationButtons repoUrl={(pin as any).repoUrl} title={pin.title} />
                </div>



                <div className="sticky top-20 lg:top-24">
                  <Tabs value={tab} onValueChange={setTab} className="w-full">
                    <TabsList className={`grid w-full h-fit ${pin.videoUrl ? 'grid-cols-4' : 'grid-cols-3'} bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-1`}>
                      <TabsTrigger
                        value="code"
                        className="rounded-2xl px-3 py-2 text-sm font-medium data-[state=active]:bg-zinc-200 data-[state=active]:text-zinc-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-600 dark:data-[state=active]:text-zinc-100 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Code
                      </TabsTrigger>
                      <TabsTrigger
                        value="figma"
                        className="rounded-2xl px-3 py-2 text-sm font-medium data-[state=active]:bg-zinc-200 data-[state=active]:text-zinc-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-600 dark:data-[state=active]:text-zinc-100 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Figma
                      </TabsTrigger>
                      {pin.videoUrl ? (
                        <TabsTrigger
                          value="video"
                          className="rounded-2xl px-3 py-2 text-sm font-medium data-[state=active]:bg-zinc-200 data-[state=active]:text-zinc-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-600 dark:data-[state=active]:text-zinc-100 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Video
                        </TabsTrigger>
                      ) : null}
                      <TabsTrigger
                        value="playground"
                        className="rounded-2xl px-3 py-2 text-sm font-medium data-[state=active]:bg-zinc-200 data-[state=active]:text-zinc-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-600 dark:data-[state=active]:text-zinc-100 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Playground
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="code" className="mt-0">
                      <div className="rounded-2xl bg-muted/50 ring-1 ring-border overflow-hidden shadow-sm w-full h-[500px] flex flex-col [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/50">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground font-medium">{pin.lang}</span>
                            <Badge variant="secondary" className="text-xs">
                              {pin.code.split('\n').length} lines
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className={`transition-all duration-200 cursor-pointer hover:scale-105 rounded-xl px-3 py-1 text-xs hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 ${copied
                                ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300'
                                : 'text-muted-foreground'
                                }`}
                              onClick={async () => {
                                await navigator.clipboard.writeText(pin.code)
                                setCopied(true)
                                setTimeout(() => {
                                  setCopied(false)
                                }, 2000)
                              }}
                            >
                              {copied ? (
                                <>
                                  <Check className="mr-1 h-3 w-3" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="mr-1 h-3 w-3" />
                                  Copy
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="relative flex-1 overflow-hidden">
                          <SyntaxHighlighter
                            language={pin.lang === "typescript" ? "tsx" : pin.lang}
                            style={{
                              ...oneDark,
                              'pre[class*="language-"]': {
                                ...oneDark['pre[class*="language-"]'],
                                background: 'transparent !important',
                              },
                              'code[class*="language-"]': {
                                ...oneDark['code[class*="language-"]'],
                                background: 'transparent !important',
                              }
                            }}
                            customStyle={{
                              margin: 0,
                              background: "transparent !important",
                              padding: "1rem",
                              fontSize: "0.85rem",
                              lineHeight: 1.6,
                              height: "100%",
                              overflowY: "auto",
                              overflowX: "hidden",
                              width: "100%",
                              maxWidth: "100%",
                              whiteSpace: "pre-wrap",
                              wordWrap: "break-word",
                              scrollbarWidth: "thin",
                              scrollbarColor: "rgba(156, 163, 175, 0.3) transparent"
                            }}
                            className="[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/50 [&>pre]:!bg-transparent [&>pre>code]:!bg-transparent"
                            showLineNumbers={true}
                            wrapLines={true}
                          >
                            {editable}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="figma" className="mt-0">
                      <div className="rounded-2xl bg-muted/50 ring-1 ring-border overflow-hidden shadow-sm w-full h-[500px] flex items-center justify-center">
                        <div className="text-center space-y-4 p-6">
                          <h3 className="text-lg font-semibold">Figma Integration</h3>
                          <p className="text-sm text-muted-foreground max-w-md">
                            Copy file and paste it in figma file to start editing UI design
                          </p>
                          <CustomTooltip content="Coming soon" side="top">
                            <Button
                              size="lg"
                              disabled
                              className="bg-muted text-muted-foreground font-medium px-6 py-3 rounded-xl shadow-sm opacity-50 cursor-not-allowed"
                            >
                              <Figma className="w-4 h-4 mr-2" />
                              Copy to Figma
                            </Button>
                          </CustomTooltip>
                        </div>
                      </div>
                    </TabsContent>

                    {pin.videoUrl ? (
                      <TabsContent value="video" className="mt-0">
                        <div className="w-full bg-muted rounded-2xl overflow-hidden shadow-sm border border-border max-w-full h-[400px] flex items-center justify-center">
                          <video className="w-full h-auto rounded-2xl" src={pin.videoUrl} controls preload="metadata" />
                        </div>
                      </TabsContent>
                    ) : null}

                    <TabsContent value="playground" className="mt-0">
                      <div className="rounded-2xl bg-muted/50 ring-1 ring-border overflow-hidden shadow-sm w-full h-[500px] flex items-center justify-center">
                        <div className="text-center space-y-4 p-6">
                          <h3 className="text-lg font-semibold">Open Playground</h3>
                          <p className="text-sm text-muted-foreground">
                            See your component in action with live code editing
                          </p>
                          <Button
                            size="lg"
                            onClick={() => setPreviewOpen(true)}
                            className="bg-primary text-primary-foreground font-medium px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
                          >
                            <BlocksIcon/>
                            Open Playground
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>

            {/* Masonry Grid Section - Clean Separation */}
            <div className="border-t border-border pt-8">
              <RelatedPins pin={pin} />
            </div>
          </div>
        </main>

        {/* Edit Pin Modal */}
        <EditPinModal open={editOpen} onOpenChange={setEditOpen} pin={pin} />

        {/* Preview Modal */}
        <PreviewModal open={previewOpen} onOpenChange={setPreviewOpen} pin={pin} />

        {/* Select Board Modal */}
        {pin && (
          <SelectBoardDialog
            open={boardModalOpen}
            onOpenChange={setBoardModalOpen}
            pin={pin}
          />
        )}
      </AppLayout>
    </AuthGuard>
  )
}
