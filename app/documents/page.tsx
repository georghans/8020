import { DocumentsView } from "./documents-view"
import { getDocuments } from "@/lib/documents/api"
import { LayoutApp } from "@/app/components/layout/layout-app"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"

export const dynamic = "force-dynamic"

export default async function DocumentsPage() {
  const initialData = await getDocuments(undefined, 1, 24)

  return (
    <MessagesProvider>
      <LayoutApp>
        <DocumentsView initialData={initialData} />
      </LayoutApp>
    </MessagesProvider>
  )
}
