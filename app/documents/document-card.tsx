"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { type PaperlessDocument } from "@/lib/documents/api"
import { Calendar, Download, FileText, Tag } from "lucide-react"

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function getTagColorStyle(color: string): React.CSSProperties {
  // Paperless returns hex colors, we need to make them readable
  return {
    backgroundColor: color + "20",
    borderColor: color + "40",
    color: color,
  }
}

type DocumentCardProps = {
  document: PaperlessDocument
}

export function DocumentCard({ document }: DocumentCardProps) {
  const previewUrl = `/api/documents/${document.id}/thumb`
  const downloadUrl = `/api/documents/${document.id}/download`

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      {/* Thumbnail preview area */}
      <div className="bg-muted relative aspect-[3/4] overflow-hidden">
        <img
          src={previewUrl}
          alt={document.title}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            // If preview fails, show placeholder
            const target = e.target as HTMLImageElement
            target.style.display = "none"
            const parent = target.parentElement
            if (parent) {
              const placeholder = parent.querySelector(".placeholder") as HTMLElement
              if (placeholder) placeholder.style.display = "flex"
            }
          }}
        />
        <div className="placeholder absolute inset-0 hidden flex-col items-center justify-center">
          <FileText className="text-muted-foreground h-12 w-12 opacity-40" />
          <span className="text-muted-foreground mt-2 text-xs">
            {document.page_count} {document.page_count === 1 ? "page" : "pages"}
          </span>
        </div>

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 transition-all group-hover:bg-black/30">
          <a
            href={downloadUrl}
            download
            className="opacity-0 transition-all group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-background/90 hover:bg-background flex h-9 w-9 items-center justify-center rounded-full shadow-sm">
              <Download className="h-4 w-4" />
            </div>
          </a>
        </div>
      </div>

      <CardContent className="p-3">
        {/* Title */}
        <h3 className="line-clamp-2 text-sm font-medium leading-tight">
          {document.title || document.original_file_name}
        </h3>

        {/* Meta info */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {document.correspondent && (
            <span className="truncate">{document.correspondent.name}</span>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(document.created)}</span>
          </div>
        </div>

        {/* Tags */}
        {document.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {document.tags.slice(0, 4).map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="text-[10px] px-1.5 py-0"
                style={getTagColorStyle(tag.color)}
              >
                <Tag className="mr-0.5 h-2.5 w-2.5" />
                {tag.name}
              </Badge>
            ))}
            {document.tags.length > 4 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                +{document.tags.length - 4}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
