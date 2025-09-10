import type { NextRequest } from "next/server"
import { getSupabaseServer, getSupabaseAdmin } from "@/lib/supabase/server"

// GET - List collaborators for a board
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: boardId } = await params
    const supabase = await getSupabaseServer()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the board belongs to the user or user is a collaborator
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .select('id, owner_id')
      .eq('id', boardId)
      .single()

    if (boardError || !board) {
      return Response.json({ error: "Board not found" }, { status: 404 })
    }

    // Check if user is owner or collaborator
    const isOwner = board.owner_id === user.id
    const { data: collaboration } = await supabase
      .from('board_collaborators')
      .select('id')
      .eq('board_id', boardId)
      .eq('user_id', user.id)
      .eq('status', 'accepted')
      .single()

    if (!isOwner && !collaboration) {
      return Response.json({ error: "Access denied" }, { status: 403 })
    }

    // Get collaborators using admin client to bypass RLS
    const adminSupabase = getSupabaseAdmin()
    const { data: collaborators, error: collaboratorsError } = await adminSupabase
      .from('board_collaborators')
      .select(`
        id,
        email,
        role,
        status,
        invited_at,
        accepted_at,
        user_id
      `)
      .eq('board_id', boardId)
      .order('created_at', { ascending: false })

    if (collaboratorsError) {
      console.error('Error fetching collaborators:', collaboratorsError)
      return Response.json({ error: "Failed to fetch collaborators" }, { status: 500 })
    }

    // Get user data for collaborators who have user_id
    const userIds = (collaborators || [])
      .map(c => c.user_id)
      .filter(Boolean)
    
    let usersMap: Record<string, any> = {}
    if (userIds.length > 0) {
      try {
        console.log('Attempting to fetch users with admin client for IDs:', userIds)
        // Use admin client to bypass RLS for user lookups
        const adminSupabase = getSupabaseAdmin()
        console.log('Admin client created, making query...')
        
        const { data: users, error: usersError } = await adminSupabase
          .from('users')
          .select('id, username, full_name, avatar_url')
          .in('id', userIds)
        
        if (usersError) {
          console.error('Error fetching users with admin client:', usersError)
          console.error('Error details:', {
            code: usersError.code,
            message: usersError.message,
            details: usersError.details,
            hint: usersError.hint
          })
        } else {
          console.log('Successfully fetched users with admin client:', users?.length || 0)
          usersMap = (users || []).reduce((acc: any, user: any) => {
            acc[user.id] = user
            return acc
          }, {})
        }
      } catch (error) {
        console.error('Error creating admin client or fetching users:', error)
      }
    }

    // Transform collaborators to include user data
    const transformedCollaborators = (collaborators || []).map((collaborator: any) => ({
      ...collaborator,
      users: collaborator.user_id ? usersMap[collaborator.user_id] : null
    }))

    return Response.json({ collaborators: transformedCollaborators })
  } catch (error) {
    console.error('Error in collaborators GET API:', error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Add collaborator to board
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: boardId } = await params
    const body = await req.json().catch(() => ({}))
    const { email, role = 'viewer' } = body

    if (!email || !email.trim()) {
      return Response.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await getSupabaseServer()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the board belongs to the user
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .select('id, owner_id, name')
      .eq('id', boardId)
      .eq('owner_id', user.id)
      .single()

    if (boardError || !board) {
      return Response.json({ error: "Board not found or access denied" }, { status: 404 })
    }

    // Check if user exists using admin client
    let existingUser = null
    try {
      console.log('Checking if user exists with email:', email.trim().toLowerCase())
      const adminSupabase = getSupabaseAdmin()
      console.log('Admin client created for user check, making query...')
      
      const { data: userData, error: userCheckError } = await adminSupabase
        .from('users')
        .select('id, email, username, full_name, avatar_url')
        .eq('email', email.trim().toLowerCase())
        .single()
      
      if (userCheckError && userCheckError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking if user exists with admin client:', userCheckError)
        console.error('Error details:', {
          code: userCheckError.code,
          message: userCheckError.message,
          details: userCheckError.details,
          hint: userCheckError.hint
        })
        return Response.json({ error: 'Failed to check if user exists' }, { status: 500 })
      } else {
        existingUser = userData
        console.log('User check successful:', existingUser ? 'User found' : 'User not found')
        
        // If user doesn't exist, that's okay - we'll still add them as a collaborator
        // They can access the board once they sign up with this email
        console.log('User not found, but will add as pending collaborator')
      }
    } catch (error) {
      console.error('Error creating admin client for user check:', error)
    }

    // Check if already a collaborator using admin client
    const adminSupabase = getSupabaseAdmin()
    const { data: existingCollaborator } = await adminSupabase
      .from('board_collaborators')
      .select('id, status')
      .eq('board_id', boardId)
      .eq('email', email.trim().toLowerCase())
      .single()

    if (existingCollaborator) {
      return Response.json({ error: "User is already a collaborator" }, { status: 409 })
    }

    // Add collaborator using admin client
    const { data: collaborator, error: collaboratorError } = await adminSupabase
      .from('board_collaborators')
      .insert([{
        board_id: boardId,
        user_id: existingUser?.id || null,
        email: email.trim().toLowerCase(),
        role,
        status: existingUser ? 'accepted' : 'pending',
        invited_by: user.id
      }])
      .select(`
        id,
        email,
        role,
        status,
        invited_at,
        user_id
      `)
      .single()

    if (collaboratorError) {
      console.error('Error adding collaborator:', collaboratorError)
      return Response.json({ error: "Failed to add collaborator" }, { status: 500 })
    }

    // Add user data to the collaborator response
    const collaboratorWithUser = {
      ...collaborator,
      users: existingUser ? {
        id: existingUser.id,
        username: existingUser.username,
        full_name: existingUser.full_name,
        avatar_url: existingUser.avatar_url
      } : null
    }

    // TODO: Send invitation email if user doesn't exist
    if (!existingUser) {
      console.log('Send invitation email to:', email)
    }

    return Response.json({ collaborator: collaboratorWithUser })
  } catch (error) {
    console.error('Error in collaborators POST API:', error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Remove collaborator from board
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: boardId } = await params
    const body = await req.json().catch(() => ({}))
    const { collaboratorId } = body

    if (!collaboratorId) {
      return Response.json({ error: "Collaborator ID is required" }, { status: 400 })
    }

    const supabase = await getSupabaseServer()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the board belongs to the user
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .select('id, owner_id')
      .eq('id', boardId)
      .eq('owner_id', user.id)
      .single()

    if (boardError || !board) {
      return Response.json({ error: "Board not found or access denied" }, { status: 404 })
    }

    // Remove collaborator using admin client
    const adminSupabase = getSupabaseAdmin()
    const { error: deleteError } = await adminSupabase
      .from('board_collaborators')
      .delete()
      .eq('id', collaboratorId)
      .eq('board_id', boardId)

    if (deleteError) {
      console.error('Error removing collaborator:', deleteError)
      return Response.json({ error: "Failed to remove collaborator" }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error in collaborators DELETE API:', error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
