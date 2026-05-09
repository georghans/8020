import { cache } from "react"

const PAPERLESS_URL = process.env.PAPERLESS_URL
const PAPERLESS_TOKEN = process.env.PAPERLESS_API_TOKEN

if (!PAPERLESS_URL || !PAPERLESS_TOKEN) {
  console.warn("Paperless environment variables not configured")
}

const paperlessHeaders = PAPERLESS_TOKEN
  ? {
      Authorization: `Token ${PAPERLESS_TOKEN}`,
      "Content-Type": "application/json",
    }
  : undefined

async function paperlessFetch(endpoint: string) {
  if (!PAPERLESS_URL || !PAPERLESS_TOKEN) {
    throw new Error("Paperless not configured")
  }
  const res = await fetch(`${PAPERLESS_URL}${endpoint}`, {
    headers: paperlessHeaders,
    next: { revalidate: 60 },
  })
  if (!res.ok) {
    throw new Error(`Paperless API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export type PaperlessDocument = {
  id: number
  title: string
  content: string
  created: string
  updated: string
  document_type: { id: number; name: string } | null
  correspondent: { id: number; name: string } | null
  tags: Array<{ id: number; name: string; color: string }>
  original_file_name: string
  page_count: number
  archived_file_name: string | null
}

export type PaperlessDocumentsResponse = {
  count: number
  results: PaperlessDocument[]
}

export const getDocuments = cache(
  async (query?: string, page = 1, pageSize = 24): Promise<PaperlessDocumentsResponse> => {
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("page_size", String(pageSize))
    params.set("ordering", "-created")
    if (query) {
      params.set("query", query)
    }

    return paperlessFetch(`/api/documents/?${params.toString()}`)
  }
)

export const getDocumentThumbnail = (documentId: number): string => {
  if (!PAPERLESS_URL) return ""
  return `${PAPERLESS_URL}/api/documents/${documentId}/thumb/`
}

export const getDocumentDownloadUrl = (documentId: number): string => {
  if (!PAPERLESS_URL) return ""
  return `${PAPERLESS_URL}/api/documents/${documentId}/download/`
}

export const getDocumentPreviewUrl = (documentId: number): string => {
  if (!PAPERLESS_URL) return ""
  return `${PAPERLESS_URL}/api/documents/${documentId}/preview/`
}
