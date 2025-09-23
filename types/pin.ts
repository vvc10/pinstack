export type Pin = {
  id: string
  title: string
  description?: string
  image: string
  url?: string
  figma_code?: string
  component_type?: string
  tags: string[]
  lang: string
  height: number
  code: string
  votes?: number
  badges?: string[]
  videoUrl?: string // optional video for reels/lightbox
  author_id?: string
  board_id?: string
  status?: string
  credits?: string
  view_count?: number
  like_count?: number
  save_count?: number
  created_at?: string
  updated_at?: string
}
