import type { NextRequest } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import type { Pin } from "@/types/pin"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status") || "all" // all, pending, published, archived
    const limitParam = searchParams.get("limit")
    const offsetParam = searchParams.get("offset")

    const limit = Math.max(1, Math.min(50, Number(limitParam) || 20))
    const offset = Math.max(0, Number(offsetParam) || 0)

    const supabase = await getSupabaseServer()

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    // Build the query for user's own pins
    let query = supabase
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
        updated_at
      `)
      .eq('author_id', user.id)

    // Apply status filter
    if (status !== "all") {
      query = query.eq('status', status)
    }

    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: pins, error } = await query

    if (error) {
      console.error('Error fetching user pins:', error)
      return Response.json({ error: "Failed to fetch pins" }, { status: 500 })
    }

    // Transform database pins to match frontend Pin type
    const items: Pin[] = (pins || []).map((pin: any) => ({
      id: pin.id,
      title: pin.title,
      description: pin.description,
      image: pin.image_url || '/placeholder.svg',
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

    const nextOffset = items.length === limit ? offset + limit : null

    return Response.json({ 
      items, 
      nextOffset,
      total: items.length,
      hasMore: nextOffset !== null
    })
  } catch (error) {
    console.error('Error in my-pins API:', error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
