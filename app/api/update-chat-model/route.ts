import { authErrorResponse, requireUser } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser()
    const { chatId, model } = await request.json()

    if (!chatId || !model) {
      return new Response(
        JSON.stringify({ error: "Missing chatId or model" }),
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("chats")
      .update({ model })
      .eq("id", chatId)
      .eq("user_id", user.userId)

    if (error) {
      console.error("Error updating chat model:", error)
      return new Response(
        JSON.stringify({
          error: "Failed to update chat model",
          details: error.message,
        }),
        { status: 500 }
      )
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    })
  } catch (err: unknown) {
    const authResponse = authErrorResponse(err)
    if (authResponse) return authResponse

    console.error("Error in update-chat-model endpoint:", err)
    return new Response(
      JSON.stringify({ error: (err as Error).message || "Internal server error" }),
      { status: 500 }
    )
  }
}
