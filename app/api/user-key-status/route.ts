import { authErrorResponse, requireUser } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await requireUser()
    return NextResponse.json({})
  } catch (error) {
    const authResponse = authErrorResponse(error)
    if (authResponse) return authResponse
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
