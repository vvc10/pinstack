import type { NextRequest } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: pinId } = await params
    const supabase = await getSupabaseServer()

    // Get current user for authorization checks
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch the pin with author information
    const { data: pin, error: pinError } = await supabase
      .from('pins')
      .select(`
        id,
        title,
        description,
        code,
        language,
        tags,
        image_url,
        author_id,
        board_id,
        status,
        credits,
        view_count,
        like_count,
        save_count,
        created_at,
        updated_at,
        users!pins_author_id_fkey (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('id', pinId)
      .single()

    if (pinError) {
      console.error('Error fetching pin:', pinError)
      return Response.json({ error: "Pin not found" }, { status: 404 })
    }

    // Check if pin is published or if user is the author (for pending pins)
    const isAuthor = user && pin.author_id === user.id
    const isPublished = pin.status === 'published'

    if (!isPublished && !isAuthor) {
      return Response.json({ error: "Pin not found" }, { status: 404 })
    }

    // Increment view count if pin is published and user is not the author
    if (isPublished && !isAuthor) {
      await supabase
        .from('pins')
        .update({ view_count: pin.view_count + 1 })
        .eq('id', pinId)
    }

    // Transform the pin data to match frontend format
    const transformedPin = {
      id: pin.id,
      title: pin.title,
      description: pin.description,
      image: pin.image_url || '/placeholder.svg',
      tags: pin.tags || [],
      lang: pin.language,
      height: 300,
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
    }

    return Response.json({ 
      pin: transformedPin,
      author: pin.users
    })
  } catch (error) {
    console.error('Error in pins GET API:', error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: pinId } = await params
    const body = await req.json()
    const { title, description, code, language, tags, image_url, credits } = body

    console.log('Updating pin with data:', { pinId, title, description, code: code?.substring(0, 50) + '...', language, tags, image_url, credits })

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

    // Check if user owns the pin
    const { data: pin, error: pinError } = await supabase
      .from('pins')
      .select('author_id')
      .eq('id', pinId)
      .single()

    if (pinError) {
      console.error('Error fetching pin:', pinError)
      return Response.json({ error: "Pin not found" }, { status: 404 })
    }

    if (pin.author_id !== user.id) {
      console.error('User does not own this pin')
      return Response.json({ error: "Unauthorized - you can only edit your own pins" }, { status: 403 })
    }

    // Update the pin
    const { data: updatedPin, error } = await supabase
      .from('pins')
      .update({
        title,
        description: description || null,
        code,
        language,
        tags: tags || [],
        image_url: image_url || null,
        credits: credits || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', pinId)
      .select()
      .single()

    if (error) {
      console.error('Error updating pin:', error)
      return Response.json({ error: "Failed to update pin" }, { status: 500 })
    }

    return Response.json(updatedPin)
  } catch (error) {
    console.error('Error in pins PUT API:', error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}