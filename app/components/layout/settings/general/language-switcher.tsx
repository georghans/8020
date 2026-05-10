"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

type Locale = "de" | "en"

export function LanguageSwitcher() {
  const t = useTranslations("Settings.General")
  const locale = useLocale() as Locale
  const router = useRouter()

  const handleValueChange = (nextLocale: string) => {
    if (nextLocale !== "de" && nextLocale !== "en") return

    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`
    router.refresh()
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium">{t("language")}</h3>
        <p className="text-muted-foreground text-xs">{t("languageDescription")}</p>
      </div>
      <Select value={locale} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[150px]" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="de">{t("german")}</SelectItem>
          <SelectItem value="en">{t("english")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
