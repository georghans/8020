import { createOpenAI } from "@ai-sdk/openai"
import { getLiteLLMModels, getLiteLLMProviderConfig } from "@/lib/litellm"
import type { ModelConfig } from "./types"

let dynamicModelsCache: ModelConfig[] | null = null
let lastFetchTime = 0
const CACHE_DURATION = 60 * 1000

function litellmModel(id: string, name = id): ModelConfig {
  return {
    id,
    name,
    provider: "LiteLLM",
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

export async function getAllModels(): Promise<ModelConfig[]> {
  const now = Date.now()

  if (dynamicModelsCache && now - lastFetchTime < CACHE_DURATION) {
    return dynamicModelsCache
  }

  const models = await getLiteLLMModels()
  dynamicModelsCache = models.map((model) => litellmModel(model.id, model.name))
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
