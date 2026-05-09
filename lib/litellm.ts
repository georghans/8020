export type LiteLLMModel = {
  id: string;
  name: string;
  object?: string;
  ownedBy?: string;
};

type LiteLLMModelResponse = {
  data?: Array<{
    id?: unknown;
    object?: unknown;
    owned_by?: unknown;
  }>;
};

export type OpenRouterModel = {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
  created?: number;
  pricing?: {
    prompt?: number;
    completion?: number;
    image?: number;
    request?: number;
  };
  architecture?: {
    modality?: string;
    tokenizer?: string;
    instruct_type?: string | null;
  };
  top_provider?: {
    context_length?: number;
    max_completion_tokens?: number | null;
    is_moderated?: boolean;
  };
  per_request_limits?: unknown;
  supported_parameters?: string[];
};

type OpenRouterModelsResponse = {
  data?: OpenRouterModel[];
};

function getLiteLLMConfig() {
  const baseUrl = process.env.LITELLM_BASE_URL;
  const apiKey = process.env.LITELLM_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error("LiteLLM is not configured");
  }

  return {
    apiKey,
    baseUrl: baseUrl.replace(/\/$/, ""),
  };
}

export function getLiteLLMProviderConfig() {
  return getLiteLLMConfig();
}

export async function getLiteLLMModels(): Promise<LiteLLMModel[]> {
  const { apiKey, baseUrl } = getLiteLLMConfig();
  const response = await fetch(`${baseUrl}/models`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`LiteLLM models request failed with ${response.status}`);
  }

  const payload = (await response.json()) as LiteLLMModelResponse;

  return (payload.data ?? []).reduce<LiteLLMModel[]>((models, model) => {
    if (typeof model.id !== "string" || model.id.length === 0) {
      return models;
    }

    models.push({
      id: model.id,
      name: model.id,
      ...(typeof model.object === "string" ? { object: model.object } : {}),
      ...(typeof model.owned_by === "string"
        ? { ownedBy: model.owned_by }
        : {}),
    });

    return models;
  }, []);
}

/**
 * Fetch the full model catalog from OpenRouter.
 * This endpoint is public and does not require authentication.
 */
export async function getOpenRouterModels(): Promise<OpenRouterModel[]> {
  const response = await fetch("https://openrouter.ai/api/v1/models", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `OpenRouter models request failed with ${response.status}`
    );
  }

  const payload = (await response.json()) as OpenRouterModelsResponse;
  return payload.data ?? [];
}
