import { authErrorResponse, requireUser } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { supabase, user } = await requireUser()
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.userId)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    const authResponse = authErrorResponse(error)
    if (authResponse) return authResponse
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase, user } = await requireUser()
    const updates = await request.json()

    delete updates.id
    delete updates.email
    delete updates.anonymous

    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.userId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const authResponse = authErrorResponse(error)
    if (authResponse) return authResponse
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
