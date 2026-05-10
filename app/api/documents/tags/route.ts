import { NextResponse } from "next/server"

const PAPERLESS_URL = process.env.PAPERLESS_URL
const PAPERLESS_TOKEN = process.env.PAPERLESS_API_TOKEN

export async function GET() {
  if (!PAPERLESS_URL || !PAPERLESS_TOKEN) {
    return NextResponse.json({ error: "Paperless not configured" }, { status: 500 })
  }

  try {
    const response = await fetch(`${PAPERLESS_URL}/api/tags/?page_size=500`, {
      headers: { Authorization: `Token ${PAPERLESS_TOKEN}` },
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch tags" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Tags fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
  }
}
