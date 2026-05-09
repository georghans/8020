import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/auth";
import {
  getLiteLLMModels,
  getLiteLLMProviderConfig,
} from "@/lib/litellm";

export const maxDuration = 60;

type ChatRequest = {
  messages?: ModelMessage[];
  model?: string;
};

function isSupportedMessage(message: ModelMessage) {
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    message.content.length > 0
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { messages, model } = body;

  if (!model || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "Missing messages or model" },
      { status: 400 },
    );
  }

  if (!messages.every(isSupportedMessage)) {
    return NextResponse.json(
      { error: "Unsupported message format" },
      { status: 400 },
    );
  }

  try {
    const models = await getLiteLLMModels();
    const requestedModel = models.find((availableModel) => {
      return availableModel.id === model;
    });

    if (!requestedModel) {
      return NextResponse.json({ error: "Unknown model" }, { status: 400 });
    }

    const { apiKey, baseUrl } = getLiteLLMProviderConfig();
    const litellm = createOpenAI({
      apiKey,
      baseURL: baseUrl,
    });

    const result = streamText({
      model: litellm.chat(model),
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Failed to stream LiteLLM chat response:", error);
    return NextResponse.json(
      { error: "Failed to stream chat response" },
      { status: 500 },
    );
  }
}
