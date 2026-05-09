import { AppIcon } from "@/components/icons/app-icon"
import OpenAIIcon from "@/components/icons/openai"
import ClaudeIcon from "@/components/icons/claude"
import GeminiIcon from "@/components/icons/gemini"

export type Provider = {
  id: string
  name: string
  available: boolean
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export const PROVIDERS: Provider[] = [
  {
    id: "litellm",
    name: "LiteLLM",
    available: true,
    icon: AppIcon,
  },
  {
    id: "openai",
    name: "OpenAI",
    available: true,
    icon: OpenAIIcon,
  },
  {
    id: "claude",
    name: "Anthropic",
    available: true,
    icon: ClaudeIcon,
  },
  {
    id: "gemini",
    name: "Google",
    available: true,
    icon: GeminiIcon,
  },
]
