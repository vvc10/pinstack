import type { NextRequest } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import type { Pin } from "@/types/pin"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
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

    // Fetch saved pins with board information
    // This will get all saved pins (both general "Saved" board and other boards)
    const { data: savedPins, error } = await supabase
      .from('pin_saves')
      .select(`
        id,
        created_at,
        board_id,
        boards (
          id,
          name
        ),
        pins (
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
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching saved pins:', error)
      return Response.json({ error: "Failed to fetch saved pins" }, { status: 500 })
    }

    // Transform the data to match frontend format
    const items: (Pin & { board_id?: string; board_name?: string; saved_at?: string; is_general_save?: boolean })[] = (savedPins || [])
      .filter(save => save.pins) // Filter out any saves where pin was deleted
      .map(save => ({
        id: save.pins.id,
        title: save.pins.title,
        description: save.pins.description,
        image: save.pins.image_url || '/placeholder.svg',
        tags: save.pins.tags || [],
        lang: save.pins.language,
        height: 300,
        code: save.pins.code,
        votes: save.pins.like_count || 0,
        author_id: save.pins.author_id,
        board_id: save.pins.board_id,
        status: save.pins.status,
        credits: save.pins.credits,
        view_count: save.pins.view_count,
        like_count: save.pins.like_count,
        save_count: save.pins.save_count,
        created_at: save.pins.created_at,
        updated_at: save.pins.updated_at,
        // Additional saved pin specific fields
        board_name: save.boards?.name || 'Unknown Board',
        saved_at: save.created_at,
        is_general_save: save.boards?.name === 'Saved' // True if this is saved to the general "Saved" board
      }))

    const nextOffset = items.length === limit ? offset + limit : null

    return Response.json({ 
      items, 
      nextOffset,
      total: items.length,
      hasMore: nextOffset !== null
    })
  } catch (error) {
    console.error('Error in saved-pins API:', error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
