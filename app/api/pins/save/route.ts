import type { NextRequest } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { pinId } = await req.json()
    const supabase = await getSupabaseServer()

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get or create a "Saved" board for general saves
    let { data: generalBoard } = await supabase
      .from('boards')
      .select('id')
      .eq('name', 'Saved')
      .eq('owner_id', user.id)
      .single()

    if (!generalBoard) {
      // Create the general "Saved" board
      const { data: newBoard, error: boardError } = await supabase
        .from('boards')
        .insert([{
          name: 'Saved',
          description: 'Your saved pins',
          owner_id: user.id,
          is_public: false
        }])
        .select('id')
        .single()

      if (boardError) {
        console.error('Error creating general board:', boardError)
        return Response.json({ error: "Failed to create board" }, { status: 500 })
      }
      generalBoard = newBoard
    }

    // Check if pin is already saved to the general board
    const { data: existingSave } = await supabase
      .from('pin_saves')
      .select('id')
      .eq('pin_id', pinId)
      .eq('user_id', user.id)
      .eq('board_id', generalBoard.id)
      .single()

    if (existingSave) {
      return Response.json({ error: "Pin already saved" }, { status: 400 })
    }

    // Save the pin to the general board
    const { error } = await supabase
      .from('pin_saves')
      .insert([{
        pin_id: pinId,
        user_id: user.id,
        board_id: generalBoard.id
      }])

    if (error) {
      console.error('Error saving pin:', error)
      return Response.json({ error: "Failed to save pin" }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error in save pin API:', error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
