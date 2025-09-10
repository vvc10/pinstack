import { cookies, headers } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"

export async function getSupabaseServer() {
  const cookieStore = await cookies()
  const headersList = await headers()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
      headers: {
        get(key: string) {
          return headersList.get(key) ?? undefined
        },
      },
    },
  )
}

export function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set')
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set')
  }
  
  console.log('Creating admin client with service role key (first 20 chars):', serviceRoleKey.substring(0, 20) + '...')
  console.log('Service role key length:', serviceRoleKey.length)
  
  // Create admin client with service role key - this bypasses ALL RLS
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      }
    }
  )
  
  console.log('Admin client created successfully with full bypass permissions')
  return client
}
