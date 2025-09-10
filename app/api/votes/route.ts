import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const pinId = searchParams.get("pinId")
  const userId = searchParams.get("userId")
  
  console.log('GET vote API called with:', { pinId, userId })
  
  if (!pinId) return NextResponse.json({ error: "pinId required" }, { status: 400 })
  
  try {
    const supabase = await getSupabaseServer()
    
    // Select both columns to handle the transition
    const { data: pin, error } = await supabase
      .from('pins')
      .select('liked_by_users, like_count')
      .eq('id', pinId)
      .single()
    
    if (error) {
      console.log('Error selecting pin data:', error)
      return NextResponse.json({ error: "Pin not found" }, { status: 404 })
    }
    
    if (!pin) {
      return NextResponse.json({ error: "Pin not found" }, { status: 404 })
    }
    
    // Handle transition from old like_count column to new liked_by_users array
    let likedUsers: string[] = []
    if (pin.liked_by_users && Array.isArray(pin.liked_by_users)) {
      // Use new array-based system
      likedUsers = pin.liked_by_users
    } else if (pin.like_count && typeof pin.like_count === 'number') {
      // Fallback to old like_count column (convert to empty array for new system)
      likedUsers = []
      console.log('Using old like_count column, initializing new system with empty array')
    } else {
      // Initialize with empty array
      likedUsers = []
    }
    
    const count = likedUsers.length
    const isLiked = userId ? likedUsers.includes(userId) : false
    
    console.log('Returning vote data:', { pinId, count, isLiked, likedUsers })
    
    return NextResponse.json({ 
      pinId, 
      count, 
      isLiked,
      likedUsers 
    })
  } catch (error) {
    console.error('Error fetching vote data:', error)
    return NextResponse.json({ error: "Failed to fetch vote data" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const pinId = body?.pinId as string | undefined
  const userId = body?.userId as string | undefined
  
  console.log('Vote API called with:', { pinId, userId })
  
  if (!pinId || !userId) {
    console.log('Missing required fields:', { pinId, userId })
    return NextResponse.json({ error: "pinId and userId required" }, { status: 400 })
  }
  
  try {
    const supabase = await getSupabaseServer()
    
    // Get current pin data with both columns
    const { data: pin, error } = await supabase
      .from('pins')
      .select('liked_by_users, like_count')
      .eq('id', pinId)
      .single()
    
    if (error) {
      console.log('Error selecting pin data:', error)
      return NextResponse.json({ error: "Pin not found" }, { status: 404 })
    }
    
    if (!pin) {
      return NextResponse.json({ error: "Pin not found" }, { status: 404 })
    }
    
    // Handle transition from old like_count column to new liked_by_users array
    let currentLikedUsers: string[] = []
    if (pin.liked_by_users && Array.isArray(pin.liked_by_users)) {
      // Use new array-based system
      currentLikedUsers = pin.liked_by_users
    } else if (pin.like_count && typeof pin.like_count === 'number') {
      // Fallback to old like_count column (start fresh with new system)
      currentLikedUsers = []
      console.log('Transitioning from old like_count column to new system')
    } else {
      // Initialize with empty array
      currentLikedUsers = []
    }
    const isCurrentlyLiked = currentLikedUsers.includes(userId)
    
    let newLikedUsers: string[]
    let isLiked: boolean
    
    if (isCurrentlyLiked) {
      // Unlike: Remove user from array
      newLikedUsers = currentLikedUsers.filter(id => id !== userId)
      isLiked = false
    } else {
      // Like: Add user to array
      newLikedUsers = [...currentLikedUsers, userId]
      isLiked = true
    }
    
    // Update the pin with new liked users array
    console.log('Updating pin with new liked users:', newLikedUsers)
    const { error: updateError } = await supabase
      .from('pins')
      .update({ liked_by_users: newLikedUsers })
      .eq('id', pinId)
    
    if (updateError) {
      console.error('Error updating like data:', updateError)
      return NextResponse.json({ error: "Failed to update like data" }, { status: 500 })
    }
    
    console.log('Successfully updated like data')
    
    const newCount = newLikedUsers.length
    
    return NextResponse.json({ 
      pinId, 
      count: newCount, 
      isLiked,
      likedUsers: newLikedUsers 
    })
  } catch (error) {
    console.error('Error toggling vote:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
