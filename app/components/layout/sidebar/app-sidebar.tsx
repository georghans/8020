"use client"

import { useBreakpoint } from "@/app/hooks/use-breakpoint"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  ClockCounterClockwise,
  FileText,
  NotePencilIcon,
  X,
} from "@phosphor-icons/react"
import { usePathname, useRouter } from "next/navigation"
import { HistoryTrigger } from "../../history/history-trigger"

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
  const isMobile = useBreakpoint(768)
  const { setOpenMobile } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()

  const isDocuments = pathname === "/documents" || pathname.startsWith("/documents/")
  const isChat = pathname === "/" || pathname.startsWith("/c/") || pathname.startsWith("/p/")

  return (
    <Sidebar
      collapsible="offcanvas"
      variant="sidebar"
      className="border-border/40 border-r bg-transparent"
    >
      <SidebarHeader className="h-14 pl-3">
        <div className="flex justify-between">
          {isMobile ? (
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-9 items-center justify-center rounded-md bg-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <X size={24} />
            </button>
          ) : (
            <div className="h-full" />
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="border-border/40 border-t">
        <ScrollArea className="flex h-full px-3 [&>div>div]:!block">
          <div className="mt-3 mb-5 flex w-full flex-col items-start gap-0">
            <NavButton
              icon={<FileText size={20} />}
              label="Documents"
              onClick={() => router.push("/documents")}
              isActive={isDocuments}
            />
            <NavButton
              icon={<NotePencilIcon size={20} />}
              label="Chat"
              shortcut="⌘⇧U"
              onClick={() => router.push("/")}
              isActive={isChat}
            />
            <HistoryTrigger
              hasSidebar={false}
              classNameTrigger="bg-transparent hover:bg-accent/80 hover:text-foreground text-primary relative inline-flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors group/history"
              icon={<ClockCounterClockwise size={20} className="mr-2" />}
              label={
                <div className="flex w-full items-center gap-2">
                  <span>Chat History</span>
                  <div className="text-muted-foreground ml-auto text-xs opacity-0 duration-150 group-hover/history:opacity-100">
                    ⌘+K
                  </div>
                </div>
              }
              hasPopover={false}
            />
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-border/40 mb-2 border-t p-3" />
    </Sidebar>
  )
}
