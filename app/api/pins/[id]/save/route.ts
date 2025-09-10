import type { NextRequest } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: pinId } = await params
    const supabase = await getSupabaseServer()

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    // Remove the pin from all user's saved pins (both general and board-specific)
    const { error } = await supabase
      .from('pin_saves')
      .delete()
      .eq('pin_id', pinId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error removing saved pin:', error)
      return Response.json({ error: "Failed to remove saved pin" }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error in remove saved pin API:', error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
