// Database types for pinstack application
// These types match the Supabase database schema

export type UserRole = 'user' | 'admin' | 'moderator'
export type PinStatus = 'draft' | 'published' | 'archived' | 'pending'
export type HackathonStatus = 'upcoming' | 'active' | 'ended' | 'cancelled'
export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface User {
  id: string
  email: string
  username: string
  full_name?: string
  avatar_url?: string
  bio?: string
  website?: string
  github_url?: string
  twitter_url?: string
  linkedin_url?: string
  role: UserRole
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Board {
  id: string
  name: string
  description?: string
  cover_image_url?: string
  is_public: boolean
  owner_id: string
  created_at: string
  updated_at: string
  // Relations
  owner?: User
  pins?: Pin[]
  pin_count?: number
}

export interface Pin {
  id: string
  title: string
  description?: string
  code: string
  language: string
  component_type?: string
  tags: string[]
  image_url?: string
  video_url?: string
  demo_url?: string
  author_id: string
  board_id?: string
  status: PinStatus
  credits?: string
  view_count: number
  like_count: number
  save_count: number
  created_at: string
  updated_at: string
  // Relations
  author?: User
  board?: Board
  is_liked?: boolean
  is_saved?: boolean
  comments?: Comment[]
  comment_count?: number
}

export interface PinLike {
  id: string
  pin_id: string
  user_id: string
  created_at: string
  // Relations
  pin?: Pin
  user?: User
}

export interface PinSave {
  id: string
  pin_id: string
  user_id: string
  board_id: string
  created_at: string
  // Relations
  pin?: Pin
  user?: User
  board?: Board
}

export interface Comment {
  id: string
  content: string
  pin_id: string
  author_id: string
  parent_id?: string
  created_at: string
  updated_at: string
  // Relations
  pin?: Pin
  author?: User
  parent?: Comment
  replies?: Comment[]
}

export interface Hackathon {
  id: string
  title: string
  description: string
  rules?: string
  prizes?: string
  start_date: string
  end_date: string
  status: HackathonStatus
  cover_image_url?: string
  organizer_id: string
  created_at: string
  updated_at: string
  // Relations
  organizer?: User
  submissions?: HackathonSubmission[]
  submission_count?: number
}

export interface HackathonSubmission {
  id: string
  hackathon_id: string
  participant_id: string
  title: string
  description: string
  repository_url?: string
  demo_url?: string
  status: SubmissionStatus
  created_at: string
  updated_at: string
  // Relations
  hackathon?: Hackathon
  participant?: User
  votes?: HackathonVote[]
  vote_count?: number
}

export interface HackathonVote {
  id: string
  submission_id: string
  voter_id: string
  created_at: string
  // Relations
  submission?: HackathonSubmission
  voter?: User
}

export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
  // Relations
  follower?: User
  following?: User
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message?: string
  data?: Record<string, any>
  is_read: boolean
  created_at: string
  // Relations
  user?: User
}

export interface LearningPath {
  id: string
  title: string
  description?: string
  cover_image_url?: string
  difficulty: string
  estimated_duration?: number
  is_published: boolean
  author_id: string
  created_at: string
  updated_at: string
  // Relations
  author?: User
  steps?: LearningPathStep[]
  step_count?: number
  user_progress?: UserLearningProgress[]
}

export interface LearningPathStep {
  id: string
  path_id: string
  title: string
  description?: string
  content?: string
  step_order: number
  is_completed: boolean
  created_at: string
  updated_at: string
  // Relations
  path?: LearningPath
}

export interface UserLearningProgress {
  id: string
  user_id: string
  path_id: string
  step_id: string
  completed_at: string
  // Relations
  user?: User
  path?: LearningPath
  step?: LearningPathStep
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  total_pages: number
}

// Filter and sort types
export interface PinFilters {
  language?: string
  tags?: string[]
  author_id?: string
  board_id?: string
  status?: PinStatus
  search?: string
}

export interface PinSort {
  field: 'created_at' | 'like_count' | 'save_count' | 'view_count'
  order: 'asc' | 'desc'
}

export interface UserFilters {
  search?: string
  role?: UserRole
  is_verified?: boolean
}

export interface BoardFilters {
  search?: string
  owner_id?: string
  is_public?: boolean
}

// Form types
export interface CreatePinData {
  title: string
  description?: string
  code: string
  language: string
  tags: string[]
  image_url?: string
  video_url?: string
  demo_url?: string
  board_id?: string
}

export interface UpdatePinData extends Partial<CreatePinData> {
  status?: PinStatus
}

export interface CreateBoardData {
  name: string
  description?: string
  cover_image_url?: string
  is_public?: boolean
}

export interface UpdateBoardData extends Partial<CreateBoardData> {}

export interface CreateCommentData {
  content: string
  pin_id: string
  parent_id?: string
}

export interface UpdateCommentData {
  content: string
}

export interface CreateHackathonData {
  title: string
  description: string
  rules?: string
  prizes?: string
  start_date: string
  end_date: string
  cover_image_url?: string
}

export interface UpdateHackathonData extends Partial<CreateHackathonData> {
  status?: HackathonStatus
}

export interface CreateHackathonSubmissionData {
  hackathon_id: string
  title: string
  description: string
  repository_url?: string
  demo_url?: string
}

export interface UpdateHackathonSubmissionData extends Partial<CreateHackathonSubmissionData> {
  status?: SubmissionStatus
}

export interface CreateLearningPathData {
  title: string
  description?: string
  cover_image_url?: string
  difficulty?: string
  estimated_duration?: number
  is_published?: boolean
}

export interface UpdateLearningPathData extends Partial<CreateLearningPathData> {}

export interface CreateLearningPathStepData {
  path_id: string
  title: string
  description?: string
  content?: string
  step_order: number
}

export interface UpdateLearningPathStepData extends Partial<CreateLearningPathStepData> {
  is_completed?: boolean
}

// Statistics types
export interface UserStats {
  pins_count: number
  boards_count: number
  followers_count: number
  following_count: number
  total_likes_received: number
  total_saves_received: number
}

export interface PinStats {
  total_pins: number
  total_likes: number
  total_saves: number
  total_views: number
  pins_by_language: Record<string, number>
  pins_by_status: Record<PinStatus, number>
}

export interface BoardStats {
  total_boards: number
  public_boards: number
  private_boards: number
  total_pins_in_boards: number
}

// Search types
export interface SearchFilters {
  query?: string
  type?: 'pins' | 'users' | 'boards' | 'hackathons' | 'learning_paths'
  language?: string
  tags?: string[]
  date_range?: {
    start: string
    end: string
  }
}

export interface SearchResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  query?: string
  filters?: SearchFilters
}
