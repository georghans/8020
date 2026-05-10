"use client"

import { useBreakpoint } from "@/app/hooks/use-breakpoint"
import { AppIcon } from "@/components/icons/app-icon"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  ChatCircle,
  FileText,
  FlowArrow,
  PlugsConnected,
  X,
} from "@phosphor-icons/react"
import { APP_NAME } from "@/lib/config"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { UserMenu } from "@/app/components/layout/user-menu"

function NavButton({
  icon,
  label,
  shortcut,
  onClick,
  isActive,
}: {
  icon: React.ReactNode
  label: string
  shortcut?: string
  onClick: () => void
  isActive: boolean
}) {
  return (
    <button
      className={`relative inline-flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors ${
        isActive
          ? "bg-accent text-foreground font-medium"
          : "bg-transparent text-primary hover:bg-accent/80 hover:text-foreground"
      }`}
      type="button"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        {icon}
        {label}
      </div>
      {shortcut && (
        <div
          className={`ml-auto text-xs opacity-0 duration-150 ${
            isActive ? "opacity-100" : "group-hover:opacity-100"
          }`}
        >
          {shortcut}
        </div>
      )}
    </button>
  )
}

export function AppSidebar() {
  const t = useTranslations("Sidebar")
  const isMobile = useBreakpoint(768)
  const { setOpenMobile } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()

  const isDocuments = pathname === "/documents" || pathname.startsWith("/documents/")
  const isWorkflows = pathname === "/workflows" || pathname.startsWith("/workflows/")
  const isIntegrations =
    pathname === "/integrations" || pathname.startsWith("/integrations/")
  const isChat =
    pathname === "/c" || pathname.startsWith("/c/") || pathname.startsWith("/p/")

  return (
    <Sidebar
      collapsible="offcanvas"
      variant="sidebar"
      className="border-border/40 border-r bg-transparent"
    >
      <SidebarHeader className="h-14 px-3">
        <div className="flex h-full items-center justify-between">
          <Link
            href="/c"
            className="inline-flex items-center"
          >
            <AppIcon className="mr-1 size-4" />
            <span className="text-xl font-medium tracking-tight">{APP_NAME}</span>
            <span className="ml-2 flex flex-col text-[10px] font-medium leading-[0.9rem] text-muted-foreground">
              <span>{t("taglineLine1")}</span>
              <span>{t("taglineLine2")}</span>
            </span>
          </Link>
          {isMobile && (
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-9 items-center justify-center rounded-md bg-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <X size={24} />
            </button>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="border-border/40 border-t">
        <ScrollArea className="flex h-full px-3 [&>div>div]:!block">
          <div className="mt-3 mb-5 flex w-full flex-col items-start gap-0">
            <NavButton
              icon={<FileText size={20} />}
              label={t("documents")}
              onClick={() => router.push("/documents")}
              isActive={isDocuments}
            />
            <NavButton
              icon={<ChatCircle size={20} />}
              label={t("chat")}
              shortcut="⌘⇧U"
              onClick={() => router.push("/c")}
              isActive={isChat}
            />
            <div className="mt-3 w-full border-t pt-3">
              <NavButton
                icon={<FlowArrow size={20} />}
                label={t("workflows")}
                onClick={() => router.push("/workflows")}
                isActive={isWorkflows}
              />
              <NavButton
                icon={<PlugsConnected size={20} />}
                label={t("integrations")}
                onClick={() => router.push("/integrations")}
                isActive={isIntegrations}
              />
            </div>
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-border/40 mb-2 border-t p-3">
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  )
}
