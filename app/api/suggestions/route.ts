import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { type, description } = await request.json()

    // Validate input
    if (!type || !description) {
      return NextResponse.json(
        { message: "Type and description are required" },
        { status: 400 }
      )
    }

    if (!["feature-request", "suggestion"].includes(type)) {
      return NextResponse.json(
        { message: "Invalid type. Must be 'feature-request' or 'suggestion'" },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await getSupabaseServer()

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      )
    }

    // Insert suggestion into database
    const { data, error } = await supabase
      .from("suggestions")
      .insert({
        user_id: user.id,
        type,
        description: description.trim(),
        status: "pending"
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { message: "Failed to save suggestion" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: "Suggestion submitted successfully",
        suggestion: data
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServer()
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = parseInt(searchParams.get("offset") || "0")

    // Build query
    let query = supabase
      .from("suggestions")
      .select(`
        id,
        type,
        description,
        status,
        priority,
        created_at,
        updated_at,
        votes_count,
        is_public,
        user_id
      `)
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (type) {
      query = query.eq("type", type)
    }
    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { message: "Failed to fetch suggestions" },
        { status: 500 }
      )
    }

    return NextResponse.json({ suggestions: data })

  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
