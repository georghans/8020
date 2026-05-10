import { LayoutApp } from "@/app/components/layout/layout-app"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  CalendarDays,
  Mail,
  MessageCircle,
  PlugZap,
  Plus,
  Settings2,
  Table2,
} from "lucide-react"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function IntegrationsPage() {
  const t = await getTranslations("Integrations")
  const integrations = [
    {
      name: t("cards.mail.name"),
      description: t("cards.mail.description"),
      status: t("status.available"),
      isAvailable: true,
      icon: Mail,
    },
    {
      name: t("cards.whatsapp.name"),
      description: t("cards.whatsapp.description"),
      status: t("status.comingSoon"),
      isAvailable: false,
      icon: MessageCircle,
    },
    {
      name: t("cards.googleCalendar.name"),
      description: t("cards.googleCalendar.description"),
      status: t("status.available"),
      isAvailable: true,
      icon: CalendarDays,
    },
    {
      name: t("cards.googleDrive.name"),
      description: t("cards.googleDrive.description"),
      status: t("status.available"),
      isAvailable: true,
      icon: Table2,
    },
  ]

  return (
    <MessagesProvider>
      <LayoutApp>
        <div className="flex min-h-full flex-col px-6 pt-6 pb-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                {t("description")}
              </p>
            </div>
            <Button size="sm" variant="outline" className="gap-1.5">
              <Plus className="h-4 w-4" />
              {t("addConnection")}
            </Button>
          </div>

          <div className="grid gap-4 py-6 md:grid-cols-3">
            <div className="rounded-md border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <PlugZap className="h-4 w-4 text-primary" />
                {t("metrics.connectedApps")}
              </div>
              <div className="mt-3 text-2xl font-semibold">0</div>
              <p className="mt-1 text-xs text-muted-foreground">{t("metrics.readyToConfigure")}</p>
            </div>
            <div className="rounded-md border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Settings2 className="h-4 w-4 text-primary" />
                {t("metrics.availableConnectors")}
              </div>
              <div className="mt-3 text-2xl font-semibold">4</div>
              <p className="mt-1 text-xs text-muted-foreground">{t("metrics.mailChatGoogle")}</p>
            </div>
            <div className="rounded-md border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CalendarDays className="h-4 w-4 text-primary" />
                {t("metrics.workflowTriggers")}
              </div>
              <div className="mt-3 text-2xl font-semibold">0</div>
              <p className="mt-1 text-xs text-muted-foreground">{t("metrics.createdFromIntegrations")}</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {integrations.map((integration) => {
              const Icon = integration.icon

              return (
                <Card key={integration.name} className="rounded-md py-0 shadow-none">
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted/40">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="truncate text-sm font-medium">{integration.name}</h2>
                        <Badge variant={integration.isAvailable ? "secondary" : "outline"}>
                          {integration.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {integration.description}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-3 h-8 gap-1.5 px-2"
                        disabled={!integration.isAvailable}
                      >
                        {t("configure")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </LayoutApp>
    </MessagesProvider>
  )
}
