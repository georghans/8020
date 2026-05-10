"use client"

import { Switch } from "@/components/ui/switch"
import { useUserPreferences } from "@/lib/user-preference-store/provider"
import { useTranslations } from "next-intl"

export function InteractionPreferences() {
  const t = useTranslations("Settings.Appearance")
  const {
    preferences,
    setPromptSuggestions,
    setShowToolInvocations,
    setShowConversationPreviews,
    setMultiModelEnabled,
  } = useUserPreferences()

  return (
    <div className="space-y-6 pb-12">
      {/* Prompt Suggestions */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">{t("promptSuggestions.title")}</h3>
            <p className="text-muted-foreground text-xs">
              {t("promptSuggestions.description")}
            </p>
          </div>
          <Switch
            checked={preferences.promptSuggestions}
            onCheckedChange={setPromptSuggestions}
          />
        </div>
      </div>
      {/* Tool Invocations */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">{t("toolInvocations.title")}</h3>
            <p className="text-muted-foreground text-xs">
              {t("toolInvocations.description")}
            </p>
          </div>
          <Switch
            checked={preferences.showToolInvocations}
            onCheckedChange={setShowToolInvocations}
          />
        </div>
      </div>
      {/* Conversation Previews */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">{t("conversationPreviews.title")}</h3>
            <p className="text-muted-foreground text-xs">
              {t("conversationPreviews.description")}
            </p>
          </div>
          <Switch
            checked={preferences.showConversationPreviews}
            onCheckedChange={setShowConversationPreviews}
          />
        </div>
      </div>
      {/* Multi-Model Chat */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">{t("multiModelChat.title")}</h3>
            <p className="text-muted-foreground text-xs">
              {t("multiModelChat.description")}
            </p>
          </div>
          <Switch
            checked={preferences.multiModelEnabled}
            onCheckedChange={setMultiModelEnabled}
          />
        </div>
      </div>
    </div>
  )
}
