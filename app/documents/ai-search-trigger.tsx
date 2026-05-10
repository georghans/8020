"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"
import { useId } from "react"

type AiSearchTriggerProps = {
  onOpen: () => void
  className?: string
}

export function AiSearchTrigger({ onOpen, className }: AiSearchTriggerProps) {
  const t = useTranslations("Documents")
  const gradientId = useId()

  return (
    <Button
      type="button"
      className={cn(
        "h-8 w-[min(11rem,calc(100vw-9.5rem))] justify-start gap-2 rounded-md border border-input bg-background px-2.5 py-0 text-xs font-normal text-muted-foreground shadow-none hover:bg-background hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring",
        className
      )}
      onClick={onOpen}
    >
      <Sparkles
        className="h-3.5 w-3.5 drop-shadow-[0_0_4px_rgba(217,70,239,0.45)]"
        fill={`url(#${gradientId})`}
        stroke={`url(#${gradientId})`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </Sparkles>
      <span className="min-w-0 flex-1 truncate text-left">{t("aiSearch")}</span>
      <span className="ml-auto shrink-0 text-xs text-muted-foreground">
        ⌘+K
      </span>
    </Button>
  )
}
