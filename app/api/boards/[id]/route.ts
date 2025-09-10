import type { NextRequest } from "next/server"
import { getSupabaseServer, getSupabaseAdmin } from "@/lib/supabase/server"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: boardId } = await params
    const supabase = await getSupabaseServer()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch board with owner information
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

    // Check if user is owner or collaborator using admin client
    const isOwner = board.owner_id === user.id
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

    console.log('Board access check:', { 
      isOwner, 
      isCollaborator, 
      collaborationStatus: collaboration?.status,
      userId: user.id,
      boardId 
    })

    if (!isOwner && !isCollaborator) {
      console.log('Access denied - user is neither owner nor collaborator')
      return Response.json({ error: "Access denied" }, { status: 403 })
    }

    // Fetch pins for this board using the board_pins junction table
    // Only show approved pins (published status) to maintain content quality
    const { data: boardPins, error: boardPinsError } = await adminSupabase
      .from('board_pins')
      .select(`
        pin_id,
        sort_order,
        added_at,
        pins!board_pins_pin_id_fkey (
          id,
          title,
          description,
          code,
          language,
          tags,
          image_url,
          author_id,
          status,
          created_at
        )
      `)
      .eq('board_id', boardId)
      .eq('pins.status', 'published') // Only show approved pins
      .order('sort_order', { ascending: true })

    if (boardPinsError) {
      console.error('Error fetching board pins:', boardPinsError)
    }

    console.log('Board pins fetched:', boardPins?.length || 0, 'pins for board:', boardId)

    // Get unique user IDs from pins
    const userIds = [...new Set((boardPins || []).map((bp: any) => bp.pins?.author_id).filter(Boolean))]
    
    // Fetch user information for all pin authors
    let usersMap: Record<string, any> = {}
    if (userIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, username, full_name, avatar_url')
        .in('id', userIds)
      
      if (usersError) {
        console.error('Error fetching users:', usersError)
      } else {
        usersMap = (users || []).reduce((acc: any, user: any) => {
          acc[user.id] = user
          return acc
        }, {})
      }
    }

    // Transform pins to match frontend format
    const transformedPins = (boardPins || []).map((boardPin: any) => {
      const pin = boardPin.pins
      return {
        id: pin.id,
        title: pin.title,
        image: pin.image_url || '/placeholder.svg',
        tags: pin.tags || [],
        lang: pin.language,
        height: 300, // Default height since it's not in the pins table
        code: pin.code,
        created_at: pin.created_at,
        author: pin.author_id ? usersMap[pin.author_id] : null
      }
    })

    // Get collaborator count using admin client
    const { count: collaboratorCount } = await adminSupabase
      .from('board_collaborators')
      .select('*', { count: 'exact', head: true })
      .eq('board_id', boardId)

    return Response.json({ 
      board: {
        ...board,
        owner: board.users,
        pins: transformedPins,
        collaboratorCount: collaboratorCount || 0
      },
      userRole: {
        isOwner,
        isCollaborator,
        collaborationRole: collaboration?.role || null,
        canEdit: isOwner || (isCollaborator && collaboration?.role === 'editor'),
        canManageCollaborators: isOwner
      }
    })
  } catch (error) {
    console.error('Error in board detail API:', error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: boardId } = await params
    const body = await req.json().catch(() => ({}))
    const pin = body?.pin

    if (!pin || !pin.id) {
      return Response.json({ error: "Pin data required" }, { status: 400 })
    }

    const supabase = await getSupabaseServer()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has edit permissions (owner or editor collaborator)
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .select('id, owner_id')
      .eq('id', boardId)
      .single()

    if (boardError || !board) {
      return Response.json({ error: "Board not found" }, { status: 404 })
    }

    const isOwner = board.owner_id === user.id
    
    // Check if user is an editor collaborator
    const adminSupabase = getSupabaseAdmin()
    const { data: collaboration } = await adminSupabase
      .from('board_collaborators')
      .select('role, status')
      .eq('board_id', boardId)
      .eq('user_id', user.id)
      .eq('status', 'accepted')
      .single()

    const canEdit = isOwner || (collaboration && collaboration.role === 'editor')
    
    if (!canEdit) {
      return Response.json({ error: "Access denied - edit permissions required" }, { status: 403 })
    }

    // Check if pin already exists in this board
    const { data: existingPin, error: checkError } = await supabase
      .from('board_pins')
      .select('pin_id')
      .eq('board_id', boardId)
      .eq('pin_id', pin.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing pin:', checkError)
      return Response.json({ error: "Failed to check existing pin" }, { status: 500 })
    }

    if (existingPin) {
      return Response.json({ error: "Pin already exists in this board" }, { status: 409 })
    }

    // Get the next sort order
    const { data: lastPin, error: orderError } = await supabase
      .from('board_pins')
      .select('sort_order')
      .eq('board_id', boardId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const nextOrder = lastPin ? lastPin.sort_order + 1 : 0

    // Add pin to board using board_pins table
    const { error } = await supabase
      .from('board_pins')
      .insert([{
        board_id: boardId,
        pin_id: pin.id,
        sort_order: nextOrder,
        added_by: user.id
      }])

    if (error) {
      console.error('Error saving pin to board:', error)
      return Response.json({ error: "Failed to save pin to board" }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error in board POST API:', error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: boardId } = await params
    const body = await req.json().catch(() => ({}))
    const pinId = body?.pinId

    if (!pinId) {
      return Response.json({ error: "Pin ID required" }, { status: 400 })
    }

    const supabase = await getSupabaseServer()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has edit permissions (owner or editor collaborator)
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .select('id, owner_id')
      .eq('id', boardId)
      .single()

    if (boardError || !board) {
      return Response.json({ error: "Board not found" }, { status: 404 })
    }

    const isOwner = board.owner_id === user.id
    
    // Check if user is an editor collaborator
    const adminSupabase = getSupabaseAdmin()
    const { data: collaboration } = await adminSupabase
      .from('board_collaborators')
      .select('role, status')
      .eq('board_id', boardId)
      .eq('user_id', user.id)
      .eq('status', 'accepted')
      .single()

    const canEdit = isOwner || (collaboration && collaboration.role === 'editor')
    
    if (!canEdit) {
      return Response.json({ error: "Access denied - edit permissions required" }, { status: 403 })
    }

    // Remove pin from board using board_pins table
    const { error } = await supabase
      .from('board_pins')
      .delete()
      .eq('board_id', boardId)
      .eq('pin_id', pinId)

    if (error) {
      console.error('Error removing pin from board:', error)
      return Response.json({ error: "Failed to remove pin from board" }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error in board DELETE API:', error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // For now, we'll skip the reordering functionality as it's complex to implement
  // with the current database schema. This could be added later with a position/order field.
  return Response.json({ error: "Reordering not implemented yet" }, { status: 501 })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: boardId } = await params
    const body = await req.json().catch(() => ({}))
    const { name, description, isSecret } = body

    if (!name || !name.trim()) {
      return Response.json({ error: "Board name is required" }, { status: 400 })
    }

    const supabase = await getSupabaseServer()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has edit permissions (owner or editor collaborator)
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .select('id, owner_id')
      .eq('id', boardId)
      .single()

    if (boardError || !board) {
      return Response.json({ error: "Board not found" }, { status: 404 })
    }

    const isOwner = board.owner_id === user.id
    
    // Check if user is an editor collaborator
    const adminSupabase = getSupabaseAdmin()
    const { data: collaboration } = await adminSupabase
      .from('board_collaborators')
      .select('role, status')
      .eq('board_id', boardId)
      .eq('user_id', user.id)
      .eq('status', 'accepted')
      .single()

    const canEdit = isOwner || (collaboration && collaboration.role === 'editor')
    
    if (!canEdit) {
      return Response.json({ error: "Access denied - edit permissions required" }, { status: 403 })
    }

    // Update board
    const { error: updateError } = await supabase
      .from('boards')
      .update({
        name: name.trim(),
        description: description?.trim() || null,
        is_public: !isSecret, // isSecret = true means is_public = false
        updated_at: new Date().toISOString()
      })
      .eq('id', boardId)

    if (updateError) {
      console.error('Error updating board:', updateError)
      return Response.json({ error: "Failed to update board" }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error in board PATCH API:', error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}