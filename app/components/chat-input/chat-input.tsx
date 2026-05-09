"use client";

import {
  ModelOption,
  ModelSelector,
} from "@/components/common/model-selector/base";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, StopIcon } from "@phosphor-icons/react";
import { useCallback, useRef } from "react";

type ChatInputProps = {
  value: string;
  onValueChange: (value: string) => void;
  onSend: () => void;
  isSubmitting?: boolean;
  onSelectModel: (model: string) => void;
  selectedModel: string;
  models: ModelOption[];
  isLoadingModels?: boolean;
  modelsError?: boolean;
  stop: () => void;
  status?: "submitted" | "streaming" | "ready" | "error";
};

export function ChatInput({
  value,
  onValueChange,
  onSend,
  isSubmitting,
  onSelectModel,
  selectedModel,
  models,
  isLoadingModels,
  modelsError,
  stop,
  status,
}: ChatInputProps) {
  const isOnlyWhitespace = (text: string) => !/[^\s]/.test(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    if (isSubmitting) {
      return;
    }

    if (status === "streaming") {
      stop();
      return;
    }

    onSend();
  }, [isSubmitting, onSend, status, stop]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (isSubmitting) {
        event.preventDefault();
        return;
      }

      if (event.key === "Enter" && status === "streaming") {
        event.preventDefault();
        return;
      }

      if (event.key === "Enter" && !event.shiftKey) {
        if (isOnlyWhitespace(value)) {
          return;
        }

        event.preventDefault();
        onSend();
      }
    },
    [isSubmitting, onSend, status, value],
  );

  return (
    <div className="relative flex w-full flex-col gap-4">
      <div
        className="relative order-2 px-2 pb-3 sm:pb-4 md:order-1"
        onClick={() => textareaRef.current?.focus()}
      >
        <PromptInput
          className="bg-popover relative z-10 p-0 pt-1 shadow-xs backdrop-blur-xl"
          maxHeight={200}
          value={value}
          onValueChange={onValueChange}
        >
          <PromptInputTextarea
            ref={textareaRef}
            placeholder="Ask 8020"
            onKeyDown={handleKeyDown}
            className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
          />
          <PromptInputActions className="mt-3 w-full justify-between p-2">
            <div className="flex min-w-0 gap-2">
              <ModelSelector
                selectedModelId={selectedModel}
                setSelectedModelId={onSelectModel}
                models={models}
                isLoadingModels={isLoadingModels}
                error={modelsError}
                className="rounded-full"
              />
            </div>
            <PromptInputAction
              tooltip={status === "streaming" ? "Stop" : "Send"}
            >
              <Button
                size="sm"
                className="size-9 rounded-full transition-all duration-300 ease-out"
                disabled={
                  !value ||
                  isSubmitting ||
                  isOnlyWhitespace(value) ||
                  (!selectedModel && status !== "streaming")
                }
                type="button"
                onClick={handleSend}
                aria-label={status === "streaming" ? "Stop" : "Send message"}
              >
                {status === "streaming" ? (
                  <StopIcon className="size-4" />
                ) : (
                  <ArrowUpIcon className="size-4" />
                )}
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>
      </div>
    </div>
  );
}
