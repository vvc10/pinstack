import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { user } = await req.json()

    if (!user || !user.id) {
      return NextResponse.json({ error: 'User data required' }, { status: 400 })
    }

    const supabase = await getSupabaseServer()

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists', user: existingUser })
    }

    // Create new user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        id: user.id,
        email: user.email,
        username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        bio: null,
        role: 'user',
        is_verified: true
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    console.log('User created successfully:', newUser)
    return NextResponse.json({ message: 'User created successfully', user: newUser })
  } catch (error) {
    console.error('Error in ensure user API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
