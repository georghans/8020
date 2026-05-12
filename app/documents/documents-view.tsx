"use client"

import { AiSearchModal } from "./ai-search-modal"
import { DocumentCard } from "./document-card"
import { DocumentListView } from "./document-list-view"
import { FilterCombobox } from "./filter-combobox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  getDocuments,
  type DocumentFilters,
  type PaperlessDocumentType,
  type PaperlessDocumentsResponse,
  type PaperlessTag,
} from "@/lib/documents/api"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileX,
  Hash,
  LayoutGrid,
  List,
  Search,
  Sparkles,
  Tag,
} from "lucide-react"
import { useCallback, useState } from "react"
import { useDebounce } from "@/app/hooks/use-debounce"

const PAGE_SIZE = 24

type SearchMode = "title_content" | "ai"
type ViewMode = "grid" | "list"

async function fetchTags(): Promise<PaperlessTag[]> {
  const res = await fetch("/api/documents/tags")
  if (!res.ok) return []
  const data = await res.json()
  return data.results ?? []
}

async function fetchDocumentTypes(): Promise<PaperlessDocumentType[]> {
  const res = await fetch("/api/documents/document-types")
  if (!res.ok) return []
  const data = await res.json()
  return data.results ?? []
}

export function DocumentsView({
  initialData,
}: {
  initialData: PaperlessDocumentsResponse
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchMode, setSearchMode] = useState<SearchMode>("title_content")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [aiSearchOpen, setAiSearchOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [selectedDocType, setSelectedDocType] = useState<number[]>([])

  const debouncedSearch = useDebounce(searchQuery, 300)

  const filters: DocumentFilters = {
    query: debouncedSearch || undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    documentType: selectedDocType.length > 0 ? selectedDocType[0] : undefined,
  }

  const hasActiveFilters =
    debouncedSearch || selectedTags.length > 0 || selectedDocType.length > 0

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["documents", filters, page],
    queryFn: () => getDocuments(filters, page, PAGE_SIZE),
    initialData:
      page === 1 && !hasActiveFilters ? initialData : undefined,
    placeholderData: (previousData) => previousData,
  })

  const { data: tags = [] } = useQuery({
    queryKey: ["document-tags"],
    queryFn: fetchTags,
    staleTime: 5 * 60 * 1000,
  })

  const { data: documentTypes = [] } = useQuery({
    queryKey: ["document-types"],
    queryFn: fetchDocumentTypes,
    staleTime: 5 * 60 * 1000,
  })

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
      setPage(1)
    },
    []
  )

  const handleTagsChange = useCallback((ids: number[]) => {
    setSelectedTags(ids)
    setPage(1)
  }, [])

  const handleDocTypeChange = useCallback((ids: number[]) => {
    setSelectedDocType(ids)
    setPage(1)
  }, [])

  const handleSearchModeChange = (mode: SearchMode) => {
    setSearchMode(mode)
    if (mode === "ai") {
      setAiSearchOpen(true)
    }
  }

  const documents = data?.results ?? []
  const totalCount = data?.count ?? 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const isLoadingInitial = isLoading && documents.length === 0

  return (
    <div className="flex h-full flex-col">
      {/* Page header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>

        {/* View toggle */}
        <div className="flex items-center gap-1 rounded-md border p-0.5">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-7 w-7 rounded-sm",
              viewMode === "list" && "bg-muted text-foreground"
            )}
            onClick={() => setViewMode("list")}
            title="List view"
          >
            <List className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-7 w-7 rounded-sm",
              viewMode === "grid" && "bg-muted text-foreground"
            )}
            onClick={() => setViewMode("grid")}
            title="Grid view"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search with mode toggle */}
          <div className="flex h-8 items-stretch overflow-hidden rounded-md border bg-background focus-within:ring-1 focus-within:ring-ring">
            <div className="relative flex items-center">
              {searchMode === "title_content" ? (
                <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <Sparkles className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-primary" />
              )}
              <Input
                placeholder={
                  searchMode === "title_content"
                    ? "Search title & content..."
                    : "AI search..."
                }
                className="h-full w-56 rounded-none border-0 pl-8 pr-2 text-xs shadow-none focus-visible:ring-0"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex items-stretch border-l">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-full rounded-none px-2 text-xs gap-1 text-muted-foreground hover:text-foreground border-0 shadow-none"
                  >
                    {searchMode === "title_content" ? "Title & content" : (
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-primary" />
                        AI search
                      </span>
                    )}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="text-xs w-40">
                  <DropdownMenuRadioGroup
                    value={searchMode}
                    onValueChange={(v) => handleSearchModeChange(v as SearchMode)}
                  >
                    <DropdownMenuRadioItem value="title_content" className="text-xs">
                      <Search className="mr-2 h-3 w-3" />
                      Title &amp; content
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="ai" className="text-xs">
                      <Sparkles className="mr-2 h-3 w-3 text-primary" />
                      AI search
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Tags filter */}
          <FilterCombobox
            label="Tags"
            icon={<Tag className="h-3 w-3" />}
            options={tags.map((t) => ({ id: t.id, name: t.name, color: t.text_colour }))}
            selected={selectedTags}
            onSelect={handleTagsChange}
            placeholder="Search tags..."
          />

          {/* Document type filter */}
          <FilterCombobox
            label="Document type"
            icon={<Hash className="h-3 w-3" />}
            options={documentTypes.map((dt) => ({ id: dt.id, name: dt.name }))}
            selected={selectedDocType}
            onSelect={handleDocTypeChange}
            placeholder="Search types..."
          />
        </div>
      </div>

      {/* Doc count + pagination info */}
      <div className="flex items-center justify-between px-6 py-3 text-xs text-muted-foreground border-b">
        <span>
          {isLoading ? (
            <Skeleton className="h-3.5 w-28" />
          ) : (
            <>
              {totalCount.toLocaleString()}{" "}
              {totalCount === 1 ? "document" : "documents"}
            </>
          )}
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="tabular-nums">
              {page} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Document content area */}
      <div className={cn("flex-1 overflow-y-auto p-6", isFetching && "opacity-60 transition-opacity")}>
        {isLoadingInitial ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
          )
        ) : documents.length === 0 ? (
          <div className="flex h-[50vh] flex-col items-center justify-center text-muted-foreground">
            <FileX className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-base font-medium">No documents found</p>
            <p className="text-xs mt-1">
              {hasActiveFilters
                ? "Try adjusting your search or filters"
                : "Your document library is empty"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        ) : (
          <DocumentListView documents={documents} />
        )}
      </div>

      {/* Bottom pagination */}
      {totalPages > 1 && !isLoadingInitial && documents.length > 0 && (
        <div className="flex items-center justify-center gap-1.5 border-t px-6 py-3">
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0 text-xs"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage(1)}
          >
            «
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 text-xs px-2"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-3 w-3" />
            Prev
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  className="h-7 w-7 p-0 text-xs"
                  onClick={() => setPage(pageNum)}
                  disabled={isFetching}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 text-xs px-2"
            disabled={page >= totalPages || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0 text-xs"
            disabled={page >= totalPages || isFetching}
            onClick={() => setPage(totalPages)}
          >
            »
          </Button>
        </div>
      )}

      {/* AI Search Modal */}
      <AiSearchModal open={aiSearchOpen} onOpenChange={setAiSearchOpen} />
    </div>
  )
}
