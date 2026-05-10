"use client"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Sparkles } from "lucide-react"

type AiSearchModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AiSearchModal({ open, onOpenChange }: AiSearchModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="px-4 pt-4 pb-0">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-sm font-semibold">AI Document Search</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Search documents using natural language — coming soon.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-3 border-t">
          <Command className="rounded-none border-none shadow-none">
            <CommandInput
              placeholder="Ask anything about your documents..."
              className="h-11 text-sm"
            />
            <CommandList className="max-h-72 min-h-48">
              <CommandEmpty className="flex flex-col items-center justify-center gap-3 py-10 text-muted-foreground">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Sparkles className="h-5 w-5 opacity-50" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">AI Search Coming Soon</p>
                  <p className="mt-0.5 text-xs">
                    Natural language search across all your documents
                  </p>
                </div>
              </CommandEmpty>

              <CommandGroup heading="Examples" className="px-2 py-1.5">
                {[
                  "Invoices from last quarter",
                  "Documents about healthcare",
                  "Contracts expiring this year",
                  "Receipts over $500",
                ].map((example) => (
                  <CommandItem
                    key={example}
                    value={example}
                    className="gap-2 rounded-md text-xs text-muted-foreground"
                    disabled
                  >
                    <Sparkles className="h-3 w-3 opacity-40" />
                    {example}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>

        <div className="border-t px-4 py-2.5">
          <p className="text-[10px] text-muted-foreground">
            AI search will allow you to find documents using natural language queries, semantic
            similarity, and intelligent filtering.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
