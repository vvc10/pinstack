import type { NextRequest } from "next/server"
import { getSupabaseServer, getSupabaseAdmin } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await getSupabaseServer()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's own boards
    const { data: ownedBoards, error: ownedError } = await supabase
      .from('boards')
      .select(`
        id,
        name,
        description,
        owner_id,
        created_at,
        updated_at,
        users!boards_owner_id_fkey (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })

    // Get boards where user is a collaborator
    const adminSupabase = getSupabaseAdmin()
    
    // First, get collaborations by user_id
    const { data: collaborationsByUserId, error: collabError1 } = await adminSupabase
      .from('board_collaborators')
      .select(`
        id,
        role,
        status,
        board_id,
        boards!board_collaborators_board_id_fkey (
          id,
          name,
          description,
          owner_id,
          created_at,
          updated_at,
          users!boards_owner_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'accepted')
      .order('created_at', { ascending: false })

    // Then, get collaborations by email (for users who joined via share URL)
    const { data: collaborationsByEmail, error: collabError2 } = await adminSupabase
      .from('board_collaborators')
      .select(`
        id,
        role,
        status,
        board_id,
        email,
        boards!board_collaborators_board_id_fkey (
          id,
          name,
          description,
          owner_id,
          created_at,
          updated_at,
          users!boards_owner_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        )
      `)
      .eq('email', user.email)
      .eq('status', 'accepted')
      .order('created_at', { ascending: false })

    // Combine both types of collaborations
    const collaborations = [...(collaborationsByUserId || []), ...(collaborationsByEmail || [])]
    
    // Remove duplicates based on board_id
    const uniqueCollaborations = collaborations.filter((collab, index, self) => 
      index === self.findIndex(c => c.board_id === collab.board_id)
    )

    console.log('Boards API - Collaboration check:', {
      userId: user.id,
      userEmail: user.email,
      collaborationsByUserId: collaborationsByUserId?.length || 0,
      collaborationsByEmail: collaborationsByEmail?.length || 0,
      totalCollaborations: collaborations.length,
      uniqueCollaborations: uniqueCollaborations.length
    })

    if (ownedError) {
      console.error('Error fetching owned boards:', ownedError)
    }
    if (collabError1) {
      console.error('Error fetching collaborations by user_id:', collabError1)
    }
    if (collabError2) {
      console.error('Error fetching collaborations by email:', collabError2)
    }

    // Combine owned boards and collaborated boards
    const ownedBoardsList = ownedBoards || []
    const collaboratedBoards = uniqueCollaborations.map(collab => ({
      ...collab.boards,
      isCollaborator: true,
      collaborationRole: collab.role
    }))

    const allBoards = [...ownedBoardsList, ...collaboratedBoards]

    // Transform to include pin count using board_pins table
    const boardsWithCount = await Promise.all(
      allBoards.map(async (board: any) => {
        const { count } = await adminSupabase
          .from('board_pins')
          .select('*', { count: 'exact', head: true })
          .eq('board_id', board.id)

        return {
          id: board.id,
          name: board.name,
          description: board.description,
          owner_id: board.owner_id,
          created_at: board.created_at,
          updated_at: board.updated_at,
          owner: board.users,
          count: count || 0,
          isCollaborator: board.isCollaborator || false,
          collaborationRole: board.collaborationRole || null
        }
      })
    )

    return Response.json({ boards: boardsWithCount })
  } catch (error) {
    console.error('Error in boards API:', error)
    return Response.json({ boards: [] }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const name = String(body?.name || "").trim()
    const description = String(body?.description || "").trim()
    const isSecret = Boolean(body?.isSecret)
    const collaborators = Array.isArray(body?.collaborators) ? body.collaborators : []
    
    if (!name) {
      return Response.json({ error: "Name required" }, { status: 400 })
    }

    const supabase = await getSupabaseServer()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: board, error } = await supabase
      .from('boards')
      .insert([{
        name,
        description: description || null,
        is_public: !isSecret, // If secret, then not public
        owner_id: user.id
      }])
      .select(`
        id,
        name,
        description,
        is_public,
        owner_id,
        created_at,
        updated_at
      `)
      .single()

    if (error) {
      console.error('Error creating board:', error)
      return Response.json({ error: "Failed to create board" }, { status: 500 })
    }

    // TODO: Handle collaborators if needed
    // For now, we'll just log them
    if (collaborators.length > 0) {
      console.log('Collaborators to add:', collaborators)
      // Future: Add collaborators to a board_collaborators table
    }

    return Response.json({ board })
  } catch (error) {
    console.error('Error in boards POST API:', error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
