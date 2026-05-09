"use client";

import { ChatInput } from "@/app/components/chat-input/chat-input";
import { SignOutButton } from "@/app/auth-actions";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { WarningCircle } from "@phosphor-icons/react";
import Link from "next/link";
import * as React from "react";

type Model = {
  id: string;
  name: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function createMessageId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function messageText(message: ChatMessage) {
  return message.content.trim();
}

function Header() {
  return (
    <header className="h-app-header pointer-events-none fixed top-0 right-0 left-0 z-50">
      <div className="relative mx-auto flex h-full max-w-full items-center justify-between bg-transparent px-4 sm:px-6 lg:bg-transparent lg:px-8">
        <div className="flex flex-1 items-center justify-between">
          <div className="-ml-0.5 flex flex-1 items-center gap-2 lg:-ml-2.5">
            <div className="flex flex-1 items-center gap-2">
              <Link
                href="/workspace"
                className="pointer-events-auto inline-flex items-center text-xl font-medium tracking-tight"
              >
                8020
              </Link>
            </div>
          </div>
          <div className="pointer-events-auto flex flex-1 items-center justify-end gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/workspace">Workspace</Link>
            </Button>
            <SignOutButton />
          </div>
        </div>
      </div>
    </header>
  );
}

function Conversation({
  messages,
  status,
}: {
  messages: ChatMessage[];
  status: "submitted" | "streaming" | "ready" | "error";
}) {
  if (!messages || messages.length === 0) {
    return <div className="h-full w-full" />;
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center overflow-x-hidden overflow-y-auto">
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 mx-auto flex w-full flex-col justify-center">
        <div className="h-app-header bg-background flex w-full lg:hidden lg:h-0" />
        <div className="h-app-header bg-background flex w-full mask-b-from-4% mask-b-to-100% lg:hidden" />
      </div>
      <div className="relative w-full">
        <div
          className="flex w-full flex-col items-center pt-20 pb-4"
          style={{
            scrollbarGutter: "stable both-edges",
            scrollbarWidth: "none",
          }}
        >
          {messages.map((message, index) => {
            const isLast = index === messages.length - 1;
            const text = messageText(message);

            if (!text && message.role === "assistant") {
              return status === "streaming" || status === "submitted" ? (
                <div
                  key={message.id}
                  className="group flex w-full max-w-3xl flex-1 items-start gap-4 px-6 pb-2"
                >
                  <div className="text-muted-foreground text-sm">Thinking...</div>
                </div>
              ) : null;
            }

            if (message.role === "user") {
              return (
                <div
                  key={message.id}
                  className={cn(
                    "group flex w-full max-w-3xl flex-col items-end gap-0.5 px-6 pb-2",
                    isLast && status === "streaming" && "min-h-scroll-anchor",
                  )}
                >
                  <div className="bg-accent relative max-w-[70%] rounded-3xl px-5 py-2.5">
                    <div className="whitespace-pre-wrap text-sm leading-6">
                      {message.content}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={message.id}
                className={cn(
                  "group flex w-full max-w-3xl flex-1 items-start gap-4 px-6 pb-2",
                  isLast && "pb-10",
                )}
              >
                <div className="relative flex min-w-full flex-col gap-2">
                  <div className="relative min-w-full bg-transparent p-0">
                    <div className="whitespace-pre-wrap text-sm leading-7">
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ChatClient() {
  const [models, setModels] = React.useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = React.useState("");
  const [modelsStatus, setModelsStatus] = React.useState<
    "loading" | "ready" | "error"
  >("loading");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [status, setStatus] = React.useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");
  const [chatError, setChatError] = React.useState("");
  const abortControllerRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function loadModels() {
      setModelsStatus("loading");
      try {
        const response = await fetch("/api/models", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load models");
        }

        const data = (await response.json()) as { models?: Model[] };
        const fetchedModels = data.models ?? [];

        if (cancelled) {
          return;
        }

        setModels(fetchedModels);
        setSelectedModel((current) => current || fetchedModels[0]?.id || "");
        setModelsStatus("ready");
      } catch {
        if (!cancelled) {
          setModelsStatus("error");
        }
      }
    }

    loadModels();

    return () => {
      cancelled = true;
    };
  }, []);

  const stop = React.useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setStatus("ready");
  }, []);

  const submit = React.useCallback(async () => {
    if (status === "streaming") {
      stop();
      return;
    }

    const trimmedInput = input.trim();
    if (!trimmedInput || !selectedModel) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmedInput,
    };
    const assistantMessage: ChatMessage = {
      id: createMessageId(),
      role: "assistant",
      content: "",
    };
    const nextMessages = [
      ...messages.filter((message) => messageText(message).length > 0),
      userMessage,
    ];

    setMessages([...nextMessages, assistantMessage]);
    setInput("");
    setChatError("");
    setStatus("submitted");

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    let assistantText = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
        signal: abortController.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error("Chat request failed");
      }

      setStatus("streaming");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        assistantText += decoder.decode(value, { stream: true });
        setMessages([
          ...nextMessages,
          { ...assistantMessage, content: assistantText },
        ]);
      }

      assistantText += decoder.decode();
      setMessages([
        ...nextMessages,
        { ...assistantMessage, content: assistantText },
      ]);
      setStatus("ready");
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        setMessages(
          assistantText
            ? [
                ...nextMessages,
                { ...assistantMessage, content: assistantText },
              ]
            : nextMessages,
        );
        setStatus("ready");
      } else {
        setChatError("The response could not be streamed. Try again.");
        setMessages(nextMessages);
        setStatus("error");
      }
    } finally {
      abortControllerRef.current = null;
    }
  }, [input, messages, selectedModel, status, stop]);

  return (
    <TooltipProvider>
      <div className="bg-background text-foreground h-dvh overflow-hidden">
        <Header />
        <main
          className={cn(
            "@container/main relative flex h-full flex-col items-center justify-end md:justify-center",
          )}
        >
          <Conversation messages={messages} status={status} />
          <div
            className={cn(
              "relative inset-x-0 bottom-0 z-50 mx-auto w-full max-w-3xl",
            )}
          >
            {chatError ? (
              <div className="text-destructive mb-3 flex items-center gap-2 px-4 text-sm">
                <WarningCircle className="size-4" />
                {chatError}
              </div>
            ) : null}
            <ChatInput
              value={input}
              onValueChange={setInput}
              onSend={submit}
              isSubmitting={status === "submitted"}
              onSelectModel={setSelectedModel}
              selectedModel={selectedModel}
              models={models}
              isLoadingModels={modelsStatus === "loading"}
              modelsError={modelsStatus === "error"}
              stop={stop}
              status={status}
            />
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
