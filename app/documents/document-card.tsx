"use client"

import { Button } from "@/components/ui/button"
import { type PaperlessDocument } from "@/lib/documents/api"
import { cn } from "@/lib/utils"
import { Calendar, Download, Eye, FileText, Hash, Pencil } from "lucide-react"
import { useTranslations } from "next-intl"

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function getTagStyle(color: string): React.CSSProperties {
  return {
    backgroundColor: color,
    color: "#fff",
    border: "none",
  }
}

type DocumentCardProps = {
  document: PaperlessDocument
}

export function DocumentCard({ document }: DocumentCardProps) {
  const t = useTranslations("Documents")
  const previewUrl = `/api/documents/${document.id}/thumb`
  const downloadUrl = `/api/documents/${document.id}/download`

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-all",
        "hover:border-border/80 hover:shadow-sm"
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted/50">
        <img
          src={previewUrl}
          alt={document.title}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = "none"
            const placeholder = target.parentElement?.querySelector(
              ".thumb-placeholder"
            ) as HTMLElement | null
            if (placeholder) placeholder.style.display = "flex"
          }}
        />

        {/* Placeholder when image fails */}
        <div className="thumb-placeholder absolute inset-0 hidden flex-col items-center justify-center gap-2">
          <FileText className="h-10 w-10 text-muted-foreground/30" />
          {document.page_count > 0 && (
            <span className="text-[10px] text-muted-foreground">
              {document.page_count}p
            </span>
          )}
        </div>

        {/* Tags overlay — top of thumbnail */}
        {document.tags.length > 0 && (
          <div className="absolute top-1.5 left-1.5 right-1.5 flex flex-wrap gap-0.5">
            {document.tags.slice(0, 3).map((tag, index) => (
              <span
                key={`${tag.id ?? tag.name}-${index}`}
                className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium leading-none"
                style={getTagStyle(tag.color)}
              >
                {tag.name}
              </span>
            ))}
            {document.tags.length > 3 && (
              <span className="inline-flex items-center rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium leading-none text-white">
                +{document.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Hover action overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/20" />
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        {/* Correspondent */}
        {document.correspondent && (
          <p className="truncate text-[11px] font-medium text-primary leading-none">
            {document.correspondent.name}
          </p>
        )}

        {/* Title */}
        <h3 className="line-clamp-2 text-xs font-medium leading-snug text-foreground">
          {document.title || document.original_file_name}
        </h3>

        {/* Meta row */}
        <div className="mt-auto flex flex-col gap-0.5 pt-1">
          {document.document_type && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <FileText className="h-2.5 w-2.5 flex-shrink-0" />
              <span className="truncate">{document.document_type.name}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="h-2.5 w-2.5 flex-shrink-0" />
            <span>{formatDate(document.created)}</span>
          </div>
          {document.archive_serial_number && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Hash className="h-2.5 w-2.5 flex-shrink-0" />
              <span>{document.archive_serial_number}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action row */}
      <div className="flex items-center justify-between border-t px-2 py-1.5">
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            asChild
          >
            <a href={`/documents/${document.id}`} title={t("edit")}>
              <Pencil className="h-3 w-3" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            asChild
          >
            <a
              href={`/api/documents/${document.id}/preview`}
              target="_blank"
              rel="noreferrer"
              title={t("preview")}
            >
              <Eye className="h-3 w-3" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            asChild
          >
            <a href={downloadUrl} download title={t("download")}>
              <Download className="h-3 w-3" />
            </a>
          </Button>
        </div>
        {document.page_count > 0 && (
          <span className="text-[10px] text-muted-foreground/60">
            {document.page_count}p
          </span>
        )}
      </div>
    </div>
  )
}
