"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { X, Upload, ChevronDown, Plus } from "lucide-react"
import { usePinOperations } from "@/hooks/use-database"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface CreatePinModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const LANGUAGES = [
  "javascript", "typescript", "python", "css", "go", "rust", "sql", "html", "php", "java", "csharp", "swift"
]

const COMPONENT_TYPES = [
  "all", "Hero", "Footer", "Navigation", "Sidebar", "Header", 
  "Carousel", "Slider", "Cards", "Accordions", "Tabs", "Modals / Dialogs",
  "Dropdowns", "Tooltips / Popovers", "Forms",
  "Search Bars", "Tables", "Grids", "Pagination", 
  "Buttons", "Alerts", "Toasts", "Badges", "Tags", "Chips",
  "dashboard", "landing", "pricing", "faq", "dark-mode", "minimal", "tailwind", "react"
]

export function CreatePinModal({ open, onOpenChange }: CreatePinModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    url: "",
    figma_code: "",
    code: "",
    languages: [] as string[],
    componentType: "",
    tags: "",
    description: "",
    credits: ""
  })
  const { createPin, loading, error } = usePinOperations()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Parse tags from comma-separated string and add component type
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
      
      // Add component type to tags if selected and not "all"
      if (formData.componentType && formData.componentType !== "all") {
        tags.push(formData.componentType)
      }

      const pinData = {
        title: formData.title,
        description: formData.description || undefined,
        code: formData.code,
        language: formData.languages.join(", "),
        tags: tags,
        image_url: formData.image || formData.url || undefined,
        url: formData.url || undefined,
        figma_code: formData.figma_code || undefined,
        credits: formData.credits || undefined
      }

      const newPin = await createPin(pinData)
      
             toast.success("🎉 Pin Created!", {
               description: `"${formData.title}" has been successfully created and published!`,
               duration: 4000,
             })
      onOpenChange(false)
      
      // Reset form
      setFormData({
        title: "",
        image: "",
        url: "",
        figma_code: "",
        code: "",
        languages: [],
        componentType: "",
        tags: "",
        description: "",
        credits: ""
      })

      // Redirect to the new pin
      router.push(`/pin/${newPin.id}`)
    } catch (err) {
             toast.error("❌ Failed to Create Pin", {
               description: error || "Something went wrong while creating your pin. Please try again.",
               duration: 5000,
             })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }))
  }

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, url: url }))
  }

  const handleLanguageToggle = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[85vw] h-[85vh] sm:w-[75vw] sm:h-[75vh] rounded-2xl max-w-none max-h-none overflow-hidden p-2 sm:p-4 m-0 z-[9999]"
        style={{
          width: '85vw',
          height: '85vh',
          maxWidth: 'none',
          maxHeight: 'none',
          zIndex: 9999
        }}
      >
        <DialogHeader className="px-3 sm:px-6 py-3 sm:py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl font-semibold">Create a new Pin</DialogTitle>
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        </DialogHeader>



                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row flex-1 overflow-hidden">
          {/* Left Side - File Upload Area */}
          <div className="flex-1 p-3 sm:p-6 sm:border-r border-b sm:border-b-0">
            <div className="h-full flex flex-col">
              {/* Main Upload Area */}
              <div className="flex-1 min-h-[200px] sm:min-h-0">
                {/* Image Upload Component */}
                <ImageUpload
                  value={formData.image}
                  onChange={handleImageChange}
                  disabled={loading}
                />
                
                {/* URL Input Field */}
                <div className="mt-4 space-y-2">
                  <Label htmlFor="url-input" className="text-sm font-medium">Or paste URL to get UI from internet</Label>
                  <Input
                    id="url-input"
                    type="url"
                    placeholder="https://example.com/screenshot.png"
                    value={formData.url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="rounded-xl sm:rounded-2xl bg-secondary dark:bg-muted border-0 text-sm sm:text-base"
                    disabled={loading}
                  />
                </div>

                {/* Figma Code Input Field */}
                <div className="mt-4 space-y-2">
                  <Label htmlFor="figma-input" className="text-sm font-medium">Figma file code (optional)</Label>
                  <Input
                    id="figma-input"
                    type="text"
                    placeholder="Paste your Figma file code here..."
                    value={formData.figma_code}
                    onChange={(e) => handleInputChange("figma_code", e.target.value)}
                    className="rounded-xl sm:rounded-2xl bg-secondary dark:bg-muted border-0 text-sm sm:text-base"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form Fields */}
          <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
            <div className="space-y-3 sm:space-y-4 h-full flex flex-col">
              {/* Title */}
              <div className="space-y-2">
              <Input
                  placeholder="Add a title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                  className="rounded-xl sm:rounded-2xl bg-secondary dark:bg-muted border-0 text-sm sm:text-base"
                required
              />
            </div>

              {/* Description */}
              <div className="space-y-2">
              <Textarea
                  placeholder="Add a detailed description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                  className="min-h-[80px] sm:min-h-[100px] rounded-xl sm:rounded-2xl bg-secondary dark:bg-muted border-0 resize-none text-sm sm:text-base"
              />
            </div>

            {/* Credits */}
            <div className="space-y-2">
              <Input
                placeholder="Credit: @username or source name (optional)"
                value={formData.credits}
                onChange={(e) => handleInputChange("credits", e.target.value)}
                className="rounded-xl sm:rounded-2xl bg-secondary dark:bg-muted border-0 text-sm sm:text-base"
              />
            </div>



                             {/* Component Type */}
               <div className="space-y-2">
                                  <Select value={formData.componentType} onValueChange={(value) => handleInputChange("componentType", value)}>
                   <SelectTrigger className="rounded-xl sm:rounded-2xl bg-secondary dark:bg-muted border-0 text-sm sm:text-base">
                     <SelectValue placeholder="Choose a component type" />
                
                   </SelectTrigger>
                   <SelectContent className="z-[10000]">
                     {COMPONENT_TYPES.map((type) => (
                       <SelectItem key={type} value={type}>
                         {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>

                             {/* Select Stack */}
               <div className="space-y-2">
                  <Label className="text-sm font-medium">Select Stack</Label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((lang) => {
                      const isSelected = formData.languages.includes(lang)
                      return (
                        <Button
                          key={lang}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleLanguageToggle(lang)}
                          className={`text-xs rounded-full ${
                            isSelected 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-secondary dark:bg-muted border-border"
                          }`}
                        >
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </Button>
                      )
                    })}
                  </div>
                  {formData.languages.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Selected: {formData.languages.join(", ")}
                    </p>
                  )}
            </div>

              {/* Tagged Topics */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Tagged topics (0)</span>
            </div>
                              <Input
                  placeholder="Search for a tag"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  className="rounded-xl sm:rounded-2xl bg-secondary dark:bg-muted border-0 text-sm sm:text-base"
                />
            </div>



              {/* Code Field */}
              <div className="space-y-2">
                              <Textarea
                  placeholder="Paste your code here..."
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  className="min-h-[120px] sm:min-h-[150px] rounded-xl sm:rounded-2xl bg-secondary dark:bg-muted border-0 resize-none font-mono text-xs sm:text-sm"
                  required
                />
            </div>

            

              {/* Submit Button */}
              <div className="pt-2 sm:pt-4">
            <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl sm:rounded-2xl bg-primary hover:bg-primary/90 text-sm sm:text-base py-2 sm:py-3"
                >
              {loading ? "Creating..." : "Create Pin"}
            </Button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
