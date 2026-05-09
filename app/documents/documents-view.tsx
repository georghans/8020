"use client"

import { DocumentCard } from "./document-card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  getDocuments,
  type PaperlessDocumentsResponse,
} from "@/lib/documents/api"
import { useQuery } from "@tanstack/react-query"
import { Search, FileX } from "lucide-react"
import { useState, useCallback } from "react"
import { useDebounce } from "@/app/hooks/use-debounce"

const PAGE_SIZE = 24

export function DocumentsView({
  initialData,
}: {
  initialData: PaperlessDocumentsResponse
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(searchQuery, 300)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["documents", debouncedSearch, page],
    queryFn: () => getDocuments(debouncedSearch || undefined, page, PAGE_SIZE),
    initialData: page === 1 && !debouncedSearch ? initialData : undefined,
    placeholderData: (previousData) => previousData,
  })

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
      setPage(1)
    },
    []
  )

  const documents = data?.results ?? []
  const totalCount = data?.count ?? 0
  const hasMore = documents.length < totalCount

  return (
    <div className="flex h-full flex-col">
      {/* Header with search */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4">
        <div className="flex items-center justify-start">
          <div className="relative w-72">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search documents..."
              className="pl-9"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {/* Document grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading && documents.length === 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="flex h-[50vh] flex-col items-center justify-center text-muted-foreground">
            <FileX className="h-12 w-12 mb-3 opacity-40" />
            <p className="text-lg font-medium">No documents found</p>
            <p className="text-sm mt-1">
              {debouncedSearch
                ? "Try a different search term"
                : "Your document library is empty"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>

            {/* Pagination */}
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={isFetching}
                  className="min-w-[140px]"
                >
                  {isFetching ? "Loading..." : "Load more"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
