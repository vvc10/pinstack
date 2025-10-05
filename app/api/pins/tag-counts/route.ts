import type { NextRequest } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get("q") || ""

    const supabase = await getSupabaseServer()

    // Build the base query
    let query = supabase
      .from('pins')
      .select('component_type')
      .eq('status', 'published')

    // Apply search query if provided
    if (q) {
      const words = q.trim().split(/\s+/).filter(word => word.length > 0)
      
      if (words.length > 0) {
        const searchConditions: string[] = []
        
        words.forEach(word => {
          searchConditions.push(`component_type.ilike.%${word}%`)
          searchConditions.push(`title.ilike.%${word}%`)
          searchConditions.push(`language.ilike.%${word}%`)
        })
        
        query = query.or(searchConditions.join(','))
      }
    }

    const { data: pins, error } = await query

    if (error) {
      console.error('Error fetching tag counts:', error)
      return Response.json({ counts: {} }, { status: 500 })
    }

    // Count occurrences of each component_type
    const counts: Record<string, number> = {}
    
    pins?.forEach((pin: any) => {
      if (pin.component_type) {
        counts[pin.component_type] = (counts[pin.component_type] || 0) + 1
      }
    })

    return Response.json({ counts })
  } catch (error) {
    console.error('Error in tag counts API:', error)
    return Response.json({ counts: {} }, { status: 500 })
  }
}