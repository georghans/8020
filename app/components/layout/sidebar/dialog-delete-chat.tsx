"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useTranslations } from "next-intl"

type DialogDeleteChatProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  chatTitle: string
  onConfirmDelete: () => Promise<void>
}

export function DialogDeleteChat({
  isOpen,
  setIsOpen,
  chatTitle,
  onConfirmDelete,
}: DialogDeleteChatProps) {
  const t = useTranslations("SidebarDialogs")
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteChatTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteChatDescription", { chatTitle })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              setIsOpen(false)
              await onConfirmDelete()
            }}
          >
            {t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
