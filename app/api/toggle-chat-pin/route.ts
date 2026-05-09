import { authErrorResponse, requireUser } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser()
    const { chatId, pinned } = await request.json()

    if (!chatId || typeof pinned !== "boolean") {
      return NextResponse.json(
        { error: "Missing chatId or pinned" },
        { status: 400 }
      )
    }

    const toggle = pinned
      ? { pinned: true, pinned_at: new Date().toISOString() }
      : { pinned: false, pinned_at: null }

    const { error } = await supabase
      .from("chats")
      .update(toggle)
      .eq("id", chatId)
      .eq("user_id", user.userId)

    if (error) {
      return NextResponse.json(
        { error: "Failed to update pinned" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    const authResponse = authErrorResponse(error)
    if (authResponse) return authResponse

    console.error("toggle-chat-pin unhandled error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
