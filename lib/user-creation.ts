import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function ensureUserExists(user: any) {
  if (!user) return null

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (existingUser) {
      return existingUser
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
      return null
    }

    console.log('User created successfully:', newUser)
    return newUser
  } catch (error) {
    console.error('Error in ensureUserExists:', error)
    return null
  }
}

export async function createUserProfile(user: any) {
  if (!user) return null

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get() { return '' },
        set() {},
        remove() {},
      },
    }
  )

  try {
    const { data, error } = await supabase
      .from('users')
      .upsert([{
        id: user.id,
        email: user.email,
        username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        bio: null,
        role: 'user',
        is_verified: true
      }], {
        onConflict: 'id'
      })
      .select()
      .single()

    if (error) {
      console.error('Error upserting user:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in createUserProfile:', error)
    return null
  }
}
