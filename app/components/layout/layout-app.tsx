"use client"

import { AppSidebar } from "@/app/components/layout/sidebar/app-sidebar"

export function LayoutApp({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex h-dvh w-full overflow-hidden">
      <AppSidebar />
      <main className="@container relative h-dvh w-0 flex-shrink flex-grow overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
