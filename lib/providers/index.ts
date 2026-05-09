import { AppIcon } from "@/components/icons/app-icon"

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
]
