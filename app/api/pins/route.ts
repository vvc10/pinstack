import type { NextRequest } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import type { Pin } from "@/types/pin"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const cursorParam = searchParams.get("cursor")
    const limitParam = searchParams.get("limit")
    const q = searchParams.get("q") || ""
    const sortParam = searchParams.get("sort") || "trending"
    const tagsParam = searchParams.get("category")

    const limit = Math.max(1, Math.min(30, Number(limitParam) || 18))
    const offset = Math.max(0, Number(cursorParam) || 0)

    const supabase = await getSupabaseServer()

    // Build the query
    let query = supabase
      .from('pins')
      .select(`
        id,
        title,
        description,
        code,
        language,
        component_type,
        tags,
        image_url,
        url,
        figma_code,
        author_id,
        board_id,
        status,
        credits,
        view_count,
        like_count,
        save_count,
        created_at,
        updated_at
      `)
      .eq('status', 'published')

    // Apply search query - component_type AND title with word-based search
    if (q) {
      console.log('🔍 Search query received:', q)
      
      // Split query into individual words
      const words = q.trim().split(/\s+/).filter(word => word.length > 0)
      console.log('🔍 Search words:', words)
      
      if (words.length > 0) {
        const searchConditions: string[] = []
        
        // For each word, create search conditions for component_type, title, and language
        words.forEach(word => {
          searchConditions.push(`component_type.ilike.%${word}%`)
          searchConditions.push(`title.ilike.%${word}%`)
          searchConditions.push(`language.ilike.%${word}%`)
        })
        
        query = query.or(searchConditions.join(','))
        console.log('🔍 Search conditions:', searchConditions)
      }
    }

    // Apply tag filtering
    if (tagsParam) {
      const componentTypes = tagsParam.split(",").filter(Boolean)
      if (componentTypes.length > 0) {
        query = query.in('component_type', componentTypes)
        console.log('🏷️ Tag filtering:', { componentTypes })
      }
    }

    // Apply sorting
    switch (sortParam) {
      case "newest":
        query = query.order('created_at', { ascending: false })
        break
      case "most-voted":
        query = query.order('like_count', { ascending: false })
        break
      case "trending":
      default:
        // Combine like_count and view_count for trending
        query = query.order('like_count', { ascending: false }).order('view_count', { ascending: false })
        break
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: pins, error } = await query

    if (error) {
      console.error('Error fetching pins:', error)
      return Response.json({ items: [], nextCursor: null }, { status: 500 })
    }

    console.log('🔍 Search results:', { 
      totalPins: pins?.length || 0, 
      searchQuery: q,
      sampleTitles: pins?.slice(0, 3).map(p => p.title) || [],
      allTitles: pins?.map(p => p.title) || []
    })


    // Transform database pins to match frontend Pin type
    const items: Pin[] = (pins || []).map((pin: any) => ({
      id: pin.id,
      title: pin.title,
      description: pin.description,
      image: pin.image_url || '/placeholder.svg',
      url: pin.url,
      figma_code: pin.figma_code,
      component_type: pin.component_type,
      tags: pin.tags || [],
      lang: pin.language,
      height: 300, // Default height, could be calculated based on code length
      code: pin.code,
      votes: pin.like_count || 0,
      author_id: pin.author_id,
      board_id: pin.board_id,
      status: pin.status,
      credits: pin.credits,
      view_count: pin.view_count,
      like_count: pin.like_count,
      save_count: pin.save_count,
      created_at: pin.created_at,
      updated_at: pin.updated_at,
    }))

    const nextCursor = items.length === limit ? offset + limit : null

    return Response.json({ items, nextCursor })
  } catch (error) {
    console.error('Error in pins API:', error)
    return Response.json({ items: [], nextCursor: null }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, code, language, component_type, tags, image_url, url, figma_code, credits } = body

    console.log('Creating pin with data:', { title, description, code: code?.substring(0, 50) + '...', language, tags, image_url })

    // Validate required fields
    if (!title || !code || !language) {
      console.error('Missing required fields:', { title: !!title, code: !!code, language: !!language })
      return Response.json({ error: "Title, code, and language are required" }, { status: 400 })
    }

    const supabase = await getSupabaseServer()

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Auth error:', authError)
      return Response.json({ error: "Authentication error" }, { status: 401 })
    }
    
    if (!user) {
      console.error('No user found')
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    console.log('User data:', { 
      id: user.id, 
      email: user.email, 
      metadata: user.user_metadata 
    })

    // Ensure user exists in users table (upsert)
    const { error: userError } = await supabase
      .from('users')
      .upsert([{
        id: user.id,
        email: user.email,
        username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        bio: null,
        role: 'user',
        is_verified: true
      }], {
        onConflict: 'id'
      })

    if (userError) {
      console.error('Error upserting user:', userError)
      return Response.json({ error: "Failed to create user profile" }, { status: 500 })
    }

    // Create the pin with pending status for admin approval
    const { data: pin, error } = await supabase
      .from('pins')
      .insert([{
        title,
        description: description || null,
        code,
        language,
        component_type: component_type || null,
        tags: tags || [],
        image_url: image_url || null,
        url: url || null,
        figma_code: figma_code || null,
        credits: credits || null,
        author_id: user.id,
        status: 'pending', // Changed from 'published' to 'pending' for admin approval
        view_count: 0,
        like_count: 0,
        save_count: 0
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating pin:', error)
      return Response.json({ error: "Failed to create pin" }, { status: 500 })
    }

    // Return success response with pending status info
    return Response.json({ 
      ...pin, 
      message: "Pin created successfully! It's now pending admin approval and will be visible to others once approved." 
    }, { status: 201 })
  } catch (error) {
    console.error('Error in pins POST API:', error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
