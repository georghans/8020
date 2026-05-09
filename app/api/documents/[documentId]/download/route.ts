import { NextRequest, NextResponse } from "next/server"

const PAPERLESS_URL = process.env.PAPERLESS_URL
const PAPERLESS_TOKEN = process.env.PAPERLESS_API_TOKEN

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  if (!PAPERLESS_URL || !PAPERLESS_TOKEN) {
    return NextResponse.json(
      { error: "Paperless not configured" },
      { status: 500 }
    )
  }

  const { documentId } = await params

  try {
    const response = await fetch(
      `${PAPERLESS_URL}/api/documents/${documentId}/download/`,
      {
        headers: {
          Authorization: `Token ${PAPERLESS_TOKEN}`,
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to download document" },
        { status: response.status }
      )
    }

    const blob = await response.blob()
    const headers = new Headers()
    headers.set(
      "Content-Disposition",
      response.headers.get("Content-Disposition") || `attachment; filename="document-${documentId}.pdf"`
    )
    headers.set("Content-Type", response.headers.get("Content-Type") || "application/pdf")

    return new NextResponse(blob, { headers })
  } catch (error) {
    console.error("Document download error:", error)
    return NextResponse.json(
      { error: "Failed to download document" },
      { status: 500 }
    )
  }
}
