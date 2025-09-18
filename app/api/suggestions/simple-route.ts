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

    // Insert suggestion into database (simple version)
    const { data, error } = await supabase
      .from("suggestions")
      .insert({
        user_id: user.id,
        type,
        description: description.trim()
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
