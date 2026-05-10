"use client"

import { cn } from "@/lib/utils"
import { ListMagnifyingGlass } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { HistoryTrigger } from "./history-trigger"

type HistorySearchTriggerProps = {
  classNameTrigger?: string
}

export function HistorySearchTrigger({
  classNameTrigger,
}: HistorySearchTriggerProps) {
  const t = useTranslations("History")

  return (
    <HistoryTrigger
      hasSidebar={false}
      classNameTrigger={cn(
        "inline-flex h-9 w-[min(16rem,calc(100vw-9.5rem))] items-center justify-start gap-2 rounded-md border border-input bg-background px-3 py-0 text-sm text-muted-foreground shadow-xs hover:bg-accent hover:text-accent-foreground",
        classNameTrigger
      )}
      icon={<ListMagnifyingGlass size={16} />}
      label={
        <span className="flex min-w-0 flex-1 items-center gap-3">
          <span className="truncate">{t("searchHistory")}</span>
          <span className="ml-auto shrink-0 text-xs text-muted-foreground">
            ⌘+K
          </span>
        </span>
      }
    />
  )
}
