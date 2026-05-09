import { authErrorResponse, requireUser } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    await requireUser()
    return NextResponse.json(
      { error: "Provider API keys are disabled; LiteLLM is configured server-side." },
      { status: 410 }
    )
  } catch (error) {
    const authResponse = authErrorResponse(error)
    if (authResponse) return authResponse
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    await requireUser()
    return NextResponse.json({ success: true })
  } catch (error) {
    const authResponse = authErrorResponse(error)
    if (authResponse) return authResponse
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
