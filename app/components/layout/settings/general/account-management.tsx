"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { useChats } from "@/lib/chat-store/chats/provider"
import { useMessages } from "@/lib/chat-store/messages/provider"
import { clearAllIndexedDBStores } from "@/lib/chat-store/persist"
import { useUser } from "@/lib/user-store/provider"
import { SignOut } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

export function AccountManagement() {
  const t = useTranslations("Settings.General")
  const { signOut } = useUser()
  const { resetChats } = useChats()
  const { resetMessages } = useMessages()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await resetMessages()
      await resetChats()
      await signOut()
      await clearAllIndexedDBStores()
      router.push("/")
    } catch (e) {
      console.error("Sign out failed:", e)
      toast({ title: t("failedToSignOut"), status: "error" })
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium">{t("account")}</h3>
        <p className="text-muted-foreground text-xs">{t("logOutOnThisDevice")}</p>
      </div>
      <Button
        variant="default"
        size="sm"
        className="flex items-center gap-2"
        onClick={handleSignOut}
      >
        <SignOut className="size-4" />
        <span>{t("signOut")}</span>
      </Button>
    </div>
  )
}
