import { createOpenAI } from "@ai-sdk/openai"
import {
  getLiteLLMModels,
  getLiteLLMProviderConfig,
  getOpenRouterModels,
  type OpenRouterModel,
} from "@/lib/litellm"
import type { ModelConfig } from "./types"

let dynamicModelsCache: ModelConfig[] | null = null
let lastFetchTime = 0
const CACHE_DURATION = 60 * 1000

function createLiteLLMModelConfig(id: string, name = id): ModelConfig {
  return {
    id,
    name,
    provider: "OpenRouter",
    providerId: "litellm",
    baseProviderId: "litellm",
    icon: "litellm",
    accessible: true,
    apiSdk: () => {
      const { apiKey, baseUrl } = getLiteLLMProviderConfig()
      return createOpenAI({ apiKey, baseURL: baseUrl }).chat(id)
    },
  }
}

function getOpenRouterIcon(provider: string): string {
  switch (provider) {
    case "openai":
      return "openai"
    case "anthropic":
      return "claude"
    case "google":
      return "gemini"
    default:
      return "litellm"
  }
}

function openRouterToModelConfig(model: OpenRouterModel): ModelConfig {
  const contextWindow =
    model.top_provider?.context_length ?? model.context_length
  const provider = model.id.split("/")[0]

  return {
    id: model.id,
    name: model.name || model.id,
    provider: "OpenRouter",
    providerId: "litellm",
    baseProviderId: "litellm",
    icon: getOpenRouterIcon(provider),
    accessible: true,
    description: model.description,
    contextWindow: contextWindow ?? undefined,
    inputCost: model.pricing?.prompt
      ? model.pricing.prompt * 1_000_000
      : undefined,
    outputCost: model.pricing?.completion
      ? model.pricing.completion * 1_000_000
      : undefined,
    vision: model.architecture?.modality?.includes("image") ?? false,
    apiSdk: () => {
      const { apiKey, baseUrl } = getLiteLLMProviderConfig()
      return createOpenAI({ apiKey, baseURL: baseUrl }).chat(model.id)
    },
  }
}

const ALLOWED_OPENROUTER_PROVIDERS = ["openai", "anthropic", "google"]
const MAX_MODELS_PER_PROVIDER = 4

function isAllowedOpenRouterModel(model: OpenRouterModel): boolean {
  const provider = model.id.split("/")[0]
  return ALLOWED_OPENROUTER_PROVIDERS.includes(provider)
}

function supportsTools(model: OpenRouterModel): boolean {
  return model.supported_parameters?.includes("tools") ?? false
}

function isNotFreeVariant(model: OpenRouterModel): boolean {
  return !model.id.endsWith(":free")
}

function isNotLatestAlias(model: OpenRouterModel): boolean {
  return !model.id.includes("-latest")
}

function pickTopModelsPerProvider(
  models: OpenRouterModel[],
  maxPerProvider: number
): OpenRouterModel[] {
  const byProvider = new Map<string, OpenRouterModel[]>()

  for (const model of models) {
    const provider = model.id.split("/")[0]
    if (!byProvider.has(provider)) {
      byProvider.set(provider, [])
    }
    byProvider.get(provider)!.push(model)
  }

  const result: OpenRouterModel[] = []
  for (const [, providerModels] of byProvider) {
    const sorted = providerModels.sort((a, b) => {
      const aTime = a.created ?? 0
      const bTime = b.created ?? 0
      return bTime - aTime
    })
    result.push(...sorted.slice(0, maxPerProvider))
  }

  return result
}

export async function getAllModels(): Promise<ModelConfig[]> {
  const now = Date.now()

  if (dynamicModelsCache && now - lastFetchTime < CACHE_DURATION) {
    return dynamicModelsCache
  }

  try {
    const openRouterModels = await getOpenRouterModels()
    const filtered = openRouterModels
      .filter(isAllowedOpenRouterModel)
      .filter(supportsTools)
      .filter(isNotFreeVariant)
      .filter(isNotLatestAlias)

    const curated = pickTopModelsPerProvider(
      filtered,
      MAX_MODELS_PER_PROVIDER
    )

    dynamicModelsCache = curated.map(openRouterToModelConfig)
  } catch (error) {
    console.warn(
      "Failed to fetch OpenRouter models, falling back to LiteLLM:",
      error
    )
    const models = await getLiteLLMModels()
    dynamicModelsCache = models.map((model) =>
      createLiteLLMModelConfig(model.id, model.name)
    )
  }

  lastFetchTime = now
  return dynamicModelsCache
}

export async function getModelsWithAccessFlags(): Promise<ModelConfig[]> {
  return getAllModels()
}

export async function getModelsForProvider(
  provider: string
): Promise<ModelConfig[]> {
  const models = await getAllModels()
  return models.filter((model) => model.providerId === provider)
}

export async function getModelsForUserProviders(): Promise<ModelConfig[]> {
  return getAllModels()
}

export function getModelInfo(modelId: string): ModelConfig | undefined {
  return dynamicModelsCache?.find((model) => model.id === modelId)
}

export const MODELS: ModelConfig[] = []

export function refreshModelsCache(): void {
  dynamicModelsCache = null
  lastFetchTime = 0
}
