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
