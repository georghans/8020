"use client"

import { Button } from "@/components/ui/button"
import { PopoverContent } from "@/components/ui/popover"
import { signInWithGoogle } from "@/lib/api"
import { APP_NAME } from "@/lib/config"
import { createClient } from "@/lib/supabase/client"
import { isSupabaseEnabled } from "@/lib/supabase/config"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useState } from "react"

export function PopoverContentAuth() {
  const t = useTranslations("Auth")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isSupabaseEnabled) {
    return null
  }

  const handleSignInWithGoogle = async () => {
    const supabase = createClient()

    if (!supabase) {
      throw new Error(t("errors.supabaseNotConfigured"))
    }

    try {
      setIsLoading(true)
      setError(null)

      const data = await signInWithGoogle(supabase)

      // Redirect to the provider URL
      if (data?.url) {
        window.location.href = data.url
      }
    } catch (err: unknown) {
      console.error("Error signing in with Google:", err)
      setError(
        (err as Error).message ||
          t("errors.unexpected")
      )
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <PopoverContent
      className="w-[300px] overflow-hidden rounded-xl p-0"
      side="top"
      align="start"
    >
      <Image
        src="/banner_forest.jpg"
        alt={`calm paint generate by ${APP_NAME}`}
        width={300}
        height={128}
        className="h-32 w-full object-cover"
      />
      {error && (
        <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
          {error}
        </div>
      )}
      <div className="p-3">
        <p className="text-primary mb-1 text-base font-medium">
          {t("loginTryMoreFeatures")}
        </p>
        <p className="text-muted-foreground mb-5 text-base">
          {t("addFilesUseMoreModels")}
        </p>
        <Button
          variant="secondary"
          className="w-full text-base"
          size="lg"
          onClick={handleSignInWithGoogle}
          disabled={isLoading}
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google logo"
            width={20}
            height={20}
            className="mr-2 size-4"
          />
          <span>{isLoading ? t("connecting") : t("continueWithGoogle")}</span>
        </Button>
      </div>
    </PopoverContent>
  )
}
