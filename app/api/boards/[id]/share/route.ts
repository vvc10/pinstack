import type { NextRequest } from "next/server"
import { getSupabaseServer, getSupabaseAdmin } from "@/lib/supabase/server"

// GET - Check if user can access board via share URL
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: boardId } = await params
    const supabase = await getSupabaseServer()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch board information
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .select(`
        id,
        name,
        description,
        is_public,
        owner_id,
        created_at,
        users!boards_owner_id_fkey (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('id', boardId)
      .single()

    if (boardError || !board) {
      return Response.json({ error: "Board not found" }, { status: 404 })
    }

    // Check if user is owner
    const isOwner = board.owner_id === user.id

    // Check if user is a collaborator using admin client
    const adminSupabase = getSupabaseAdmin()
    
    // First check by user_id
    let { data: collaboration } = await adminSupabase
      .from('board_collaborators')
      .select('id, status, role, email')
      .eq('board_id', boardId)
      .eq('user_id', user.id)
      .single()
    
    // If not found by user_id, check by email
    if (!collaboration) {
      console.log('No collaboration found by user_id, checking by email:', user.email)
      const { data: emailCollaboration } = await adminSupabase
        .from('board_collaborators')
        .select('id, status, role, email, user_id')
        .eq('board_id', boardId)
        .eq('email', user.email)
        .single()
      
      if (emailCollaboration) {
        console.log('Found collaboration by email:', emailCollaboration)
        // Update the collaboration record to link it to the user_id
        const { error: updateError } = await adminSupabase
          .from('board_collaborators')
          .update({ user_id: user.id })
          .eq('id', emailCollaboration.id)
        
        if (updateError) {
          console.error('Error updating collaboration user_id:', updateError)
        } else {
          console.log('Updated collaboration with user_id')
        }
        
        collaboration = emailCollaboration
      }
    }

    const isCollaborator = collaboration && (collaboration.status === 'accepted' || collaboration.status === 'pending')

    // Check if board is public
    const isPublic = board.is_public

    // Determine access level
    let accessLevel = 'none'
    if (isOwner) {
      accessLevel = 'owner'
    } else if (isCollaborator) {
      accessLevel = collaboration.status === 'accepted' ? 'collaborator' : 'pending'
    } else if (isPublic) {
      accessLevel = 'public'
    }

    // Get collaborator count using admin client
    const { count: collaboratorCount } = await adminSupabase
      .from('board_collaborators')
      .select('*', { count: 'exact', head: true })
      .eq('board_id', boardId)

    // Get pins for this board if user has access
    let pins = []
    console.log('Access level:', accessLevel, 'isOwner:', isOwner, 'isCollaborator:', isCollaborator, 'isPublic:', isPublic)
    if (accessLevel !== 'none') {
      console.log('Fetching pins for board:', boardId)
      const { data: boardPins, error: pinsError } = await adminSupabase
        .from('board_pins')
        .select(`
          pins!inner (
            id,
            title,
            image_url,
            tags,
            language,
            height,
            code,
            status,
            created_at,
            author_id,
            users!pins_author_id_fkey (
              id,
              username,
              avatar_url
            )
          )
        `)
        .eq('board_id', boardId)
        .eq('pins.status', 'published') // Only show approved pins
        .order('created_at', { ascending: false })

      console.log('Board pins query result:', { boardPins, pinsError, count: boardPins?.length })
      if (pinsError) {
        console.error('Error fetching board pins:', pinsError)
      }
      pins = (boardPins || []).map(bp => ({
        id: bp.pins.id,
        title: bp.pins.title,
        image: bp.pins.image_url,
        tags: bp.pins.tags || [],
        lang: bp.pins.language,
        height: bp.pins.height || 300,
        code: bp.pins.code,
        created_at: bp.pins.created_at,
        author: bp.pins.users ? {
          id: bp.pins.users.id,
          username: bp.pins.users.username,
          avatar_url: bp.pins.users.avatar_url
        } : null
      }))
    }

    const response = {
      board: {
        ...board,
        accessLevel,
        collaboratorCount: collaboratorCount || 0,
        isOwner,
        isCollaborator: !!isCollaborator,
        isPublic,
        canEdit: isOwner || (isCollaborator && collaboration?.status === 'accepted'),
        pins
      }
    }
    
    console.log('Final response:', { 
      accessLevel, 
      pinsCount: pins.length, 
      isOwner, 
      isCollaborator, 
      canEdit: response.board.canEdit 
    })
    
    return Response.json(response)

  } catch (error) {
    console.error('Error in board share API:', error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Accept collaboration invitation
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: boardId } = await params
    const supabase = await getSupabaseServer()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user already has a collaboration record using admin client
    console.log('Checking collaboration for user:', user.id, 'email:', user.email, 'board:', boardId)
    const adminSupabase = getSupabaseAdmin()
    
    // First check by user_id
    let { data: existingCollaboration, error: collaborationError } = await adminSupabase
      .from('board_collaborators')
      .select('id, status, role, email, user_id')
      .eq('board_id', boardId)
      .eq('user_id', user.id)
      .single()
    
    // If not found by user_id, check by email
    if (!existingCollaboration) {
      console.log('No collaboration found by user_id, checking by email:', user.email)
      const { data: emailCollaboration, error: emailError } = await adminSupabase
        .from('board_collaborators')
        .select('id, status, role, email, user_id')
        .eq('board_id', boardId)
        .eq('email', user.email)
        .single()
      
      if (emailCollaboration) {
        console.log('Found collaboration by email:', emailCollaboration)
        // Update the collaboration record to link it to the user_id
        const { error: updateError } = await adminSupabase
          .from('board_collaborators')
          .update({ user_id: user.id })
          .eq('id', emailCollaboration.id)
        
        if (updateError) {
          console.error('Error updating collaboration user_id:', updateError)
        } else {
          console.log('Updated collaboration with user_id')
        }
        
        existingCollaboration = emailCollaboration
      } else {
        collaborationError = emailError
      }
    }

    console.log('Collaboration query result:', { existingCollaboration, collaborationError })

    if (collaborationError && collaborationError.code !== 'PGRST116') {
      console.error('Error checking collaboration:', collaborationError)
      return Response.json({ error: "Failed to check collaboration status" }, { status: 500 })
    }

    if (existingCollaboration) {
      console.log('Existing collaboration found:', existingCollaboration)
      // User already has a collaboration record
      if (existingCollaboration.status === 'accepted') {
        return Response.json({ 
          success: true, 
          message: "You are already a collaborator on this board" 
        })
      } else if (existingCollaboration.status === 'pending') {
        // Accept the pending invitation
        const { error: updateError } = await adminSupabase
          .from('board_collaborators')
          .update({ 
            status: 'accepted',
            accepted_at: new Date().toISOString()
          })
          .eq('id', existingCollaboration.id)

        if (updateError) {
          console.error('Error accepting collaboration:', updateError)
          return Response.json({ error: "Failed to accept invitation" }, { status: 500 })
        }

        console.log('Collaboration accepted successfully')
        return Response.json({ 
          success: true, 
          message: "Collaboration invitation accepted successfully" 
        })
      }
    }

    // If no collaboration exists, check if board is public or if user can request access
    const { data: board } = await adminSupabase
      .from('boards')
      .select('id, is_public, owner_id')
      .eq('id', boardId)
      .single()

    if (!board) {
      return Response.json({ error: "Board not found" }, { status: 404 })
    }

    // If no collaboration exists and board is not public, user needs to be invited
    return Response.json({ 
      error: "No collaboration invitation found. Please ask the board owner to invite you." 
    }, { status: 404 })

  } catch (error) {
    console.error('Error accepting collaboration:', error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}