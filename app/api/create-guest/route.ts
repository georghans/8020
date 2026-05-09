import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Guest mode is disabled. Please sign in with Keycloak." },
    { status: 410 }
  )
}
