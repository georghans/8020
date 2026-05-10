import { LayoutApp } from "@/app/components/layout/layout-app"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Bot, Clock, GitBranch, Play, Plus } from "lucide-react"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function WorkflowsPage() {
  const t = await getTranslations("Workflows")
  const workflows = [
    {
      name: t("cards.invoiceIntake.name"),
      description: t("cards.invoiceIntake.description"),
      status: t("status.draft"),
      isActive: false,
      steps: 5,
    },
    {
      name: t("cards.leadFollowUp.name"),
      description: t("cards.leadFollowUp.description"),
      status: t("status.active"),
      isActive: true,
      steps: 8,
    },
    {
      name: t("cards.weeklyBrief.name"),
      description: t("cards.weeklyBrief.description"),
      status: t("status.paused"),
      isActive: false,
      steps: 4,
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
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              {t("newWorkflow")}
            </Button>
          </div>

          <div className="grid gap-4 py-6 md:grid-cols-3">
            <div className="rounded-md border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Bot className="h-4 w-4 text-primary" />
                {t("metrics.autonomousRuns")}
              </div>
              <div className="mt-3 text-2xl font-semibold">12</div>
              <p className="mt-1 text-xs text-muted-foreground">{t("metrics.last7Days")}</p>
            </div>
            <div className="rounded-md border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <GitBranch className="h-4 w-4 text-primary" />
                {t("metrics.activeWorkflows")}
              </div>
              <div className="mt-3 text-2xl font-semibold">1</div>
              <p className="mt-1 text-xs text-muted-foreground">{t("metrics.draftsReady")}</p>
            </div>
            <div className="rounded-md border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-primary" />
                {t("metrics.savedTime")}
              </div>
              <div className="mt-3 text-2xl font-semibold">8.5h</div>
              <p className="mt-1 text-xs text-muted-foreground">{t("metrics.estimatedThisMonth")}</p>
            </div>
          </div>

          <div className="grid gap-3">
            {workflows.map((workflow) => (
              <Card key={workflow.name} className="rounded-md py-0 shadow-none">
                <CardHeader className="grid-cols-[1fr_auto] gap-3 px-4 py-4">
                  <div>
                    <CardTitle className="text-base">{workflow.name}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {workflow.description}
                    </p>
                  </div>
                  <Badge variant={workflow.isActive ? "default" : "secondary"}>
                    {workflow.status}
                  </Badge>
                </CardHeader>
                <CardContent className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
                  <span>{t("stepsConfigured", { count: workflow.steps })}</span>
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2">
                    <Play className="h-3.5 w-3.5" />
                    {t("open")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </LayoutApp>
    </MessagesProvider>
  )
}
