import { getRequestConfig } from "next-intl/server"
import { cookies } from "next/headers"

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get("locale")?.value
  const locale = cookieLocale === "en" || cookieLocale === "de" ? cookieLocale : "de"

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
