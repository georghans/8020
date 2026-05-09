import { z } from "zod"
import { tool } from "ai"

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
  })
  if (!res.ok) {
    throw new Error(`Paperless API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export const searchDocuments = tool({
  description: "Search documents in Paperless using full-text search. Returns document titles, dates, correspondents, and tags.",
  parameters: z.object({
    query: z.string().describe("Search query string"),
    page: z.number().describe("Page number for pagination"),
  }),
  execute: async ({ query, page }) => {
    const data = await paperlessFetch(`/api/documents/?query=${encodeURIComponent(query)}&page=${page ?? 1}`)
    return {
      count: data.count,
      results: data.results.map((doc: {
        id: number
        title: string
        created: string
        correspondent?: { name: string }
        document_type?: { name: string }
        tags: Array<{ name: string }>
      }) => ({
        id: doc.id,
        title: doc.title,
        date: doc.created,
        correspondent: doc.correspondent?.name ?? null,
        documentType: doc.document_type?.name ?? null,
        tags: doc.tags.map((t) => t.name),
      })),
    }
  },
})

export const getDocument = tool({
  description: "Get full details of a specific document by ID, including content and metadata.",
  parameters: z.object({
    id: z.number().describe("Document ID"),
  }),
  execute: async ({ id }) => {
    return paperlessFetch(`/api/documents/${id}/`)
  },
})

export const listDocuments = tool({
  description: "List recent documents from Paperless with pagination.",
  parameters: z.object({
    page: z.number().describe("Page number"),
    pageSize: z.number().describe("Items per page"),
  }),
  execute: async ({ page, pageSize }) => {
    const data = await paperlessFetch(`/api/documents/?page=${page ?? 1}&page_size=${pageSize ?? 20}`)
    return {
      count: data.count,
      results: data.results.map((doc: {
        id: number
        title: string
        created: string
        correspondent?: { name: string }
        document_type?: { name: string }
        tags: Array<{ name: string }>
      }) => ({
        id: doc.id,
        title: doc.title,
        date: doc.created,
        correspondent: doc.correspondent?.name ?? null,
        documentType: doc.document_type?.name ?? null,
        tags: doc.tags.map((t) => t.name),
      })),
    }
  },
})

export const listTags = tool({
  description: "List all tags available in Paperless.",
  parameters: z.object({}),
  execute: async () => {
    const data = await paperlessFetch("/api/tags/")
    return data.results.map((tag: { id: number; name: string; color: string }) => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
    }))
  },
})

export const listCorrespondents = tool({
  description: "List all correspondents (people/organizations) in Paperless.",
  parameters: z.object({}),
  execute: async () => {
    const data = await paperlessFetch("/api/correspondents/")
    return data.results.map((c: { id: number; name: string }) => ({
      id: c.id,
      name: c.name,
    }))
  },
})

export const listDocumentTypes = tool({
  description: "List all document types in Paperless.",
  parameters: z.object({}),
  execute: async () => {
    const data = await paperlessFetch("/api/document_types/")
    return data.results.map((dt: { id: number; name: string }) => ({
      id: dt.id,
      name: dt.name,
    }))
  },
})

export const paperlessTools = {
  searchDocuments,
  getDocument,
  listDocuments,
  listTags,
  listCorrespondents,
  listDocumentTypes,
}
