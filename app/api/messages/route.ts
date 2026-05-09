import { authErrorResponse, requireUser } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { supabase, user } = await requireUser()
    const { searchParams } = new URL(request.url)
    const chatId = searchParams.get("chatId")
    const limit = searchParams.get("limit")

    if (!chatId) {
      return NextResponse.json({ error: "Missing chatId" }, { status: 400 })
    }

    const { data: chat } = await supabase
      .from("chats")
      .select("id")
      .eq("id", chatId)
      .eq("user_id", user.userId)
      .single()

    if (!chat) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    let query = supabase
      .from("messages")
      .select(
        "id, content, role, experimental_attachments, created_at, parts, message_group_id, model"
      )
      .eq("chat_id", chatId)
      .order("created_at", { ascending: limit ? false : true })

    if (limit) query = query.limit(Number(limit))

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({
      messages: limit ? [...(data ?? [])].reverse() : (data ?? []),
    })
  } catch (error) {
    const authResponse = authErrorResponse(error)
    if (authResponse) return authResponse
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { supabase, user } = await requireUser()
    const { searchParams } = new URL(request.url)
    const chatId = searchParams.get("chatId")

    if (!chatId) {
      return NextResponse.json({ error: "Missing chatId" }, { status: 400 })
    }

    const { data: chat } = await supabase
      .from("chats")
      .select("id")
      .eq("id", chatId)
      .eq("user_id", user.userId)
      .single()

    if (!chat) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const { error } = await supabase.from("messages").delete().eq("chat_id", chatId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (error) {
    const authResponse = authErrorResponse(error)
    if (authResponse) return authResponse
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
