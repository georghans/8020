import { authErrorResponse, requireUser } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser()
    const { message } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 })
    }

    const { error } = await supabase.from("feedback").insert({
      message,
      user_id: user.userId,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (error) {
    const authResponse = authErrorResponse(error)
    if (authResponse) return authResponse
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
