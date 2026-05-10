import { getTranslations } from "next-intl/server"

export default async function NotFound() {
  const t = await getTranslations("NotFound")

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">
          {t("description")}
        </p>
      </div>
    </div>
  )
}
