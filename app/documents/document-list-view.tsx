"use client"

import { type PaperlessDocument } from "@/lib/documents/api"
import { Download, Eye, FileText, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  }
}

type DocumentListViewProps = {
  documents: PaperlessDocument[]
}

export function DocumentListView({ documents }: DocumentListViewProps) {
  const t = useTranslations("Documents")
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[640px] text-xs">
        <thead>
          <tr className="border-b text-muted-foreground">
            <th className="px-3 py-2 text-left font-medium w-16">{t("asn")}</th>
            <th className="px-3 py-2 text-left font-medium w-32">{t("correspondent")}</th>
            <th className="px-3 py-2 text-left font-medium">{t("titleColumn")}</th>
            <th className="px-3 py-2 text-left font-medium w-32 hidden md:table-cell">
              {t("docType")}
            </th>
            <th className="px-3 py-2 text-left font-medium w-24 hidden sm:table-cell">
              {t("created")}
            </th>
            <th className="px-3 py-2 text-right font-medium w-24">{t("actions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {documents.map((doc) => (
            <DocumentListRow key={doc.id} document={doc} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DocumentListRow({ document }: { document: PaperlessDocument }) {
  const downloadUrl = `/api/documents/${document.id}/download`

  return (
    <tr className="group transition-colors hover:bg-muted/40">
      {/* ASN */}
      <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">
        {document.archive_serial_number ?? ""}
      </td>

      {/* Correspondent */}
      <td className="px-3 py-2">
        {document.correspondent ? (
          <span className="truncate font-medium text-primary">
            {document.correspondent.name}
          </span>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        )}
      </td>

      {/* Title + inline tags */}
      <td className="px-3 py-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <a
            href={`/documents/${document.id}`}
            className="font-medium text-foreground hover:text-primary hover:underline underline-offset-2 transition-colors"
          >
            {document.title || document.original_file_name}
          </a>
          {document.tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium leading-none"
              style={getTagStyle(tag.color)}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </td>

      {/* Document type */}
      <td className="px-3 py-2 hidden md:table-cell">
        {document.document_type ? (
          <div className="flex items-center gap-1 text-muted-foreground">
            <FileText className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{document.document_type.name}</span>
          </div>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        )}
      </td>

      {/* Created */}
      <td className="px-3 py-2 text-muted-foreground hidden sm:table-cell whitespace-nowrap">
        {formatDate(document.created)}
      </td>

      {/* Actions */}
      <td className="px-3 py-2">
        <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
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
      </td>
    </tr>
  )
}
