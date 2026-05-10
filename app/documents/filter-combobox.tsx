"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

type FilterOption = {
  id: number
  name: string
  color?: string
}

type FilterComboboxProps = {
  label: string
  icon?: React.ReactNode
  options: FilterOption[]
  selected: number[]
  onSelect: (ids: number[]) => void
  placeholder?: string
}

function getTagColorStyle(color: string) {
  return {
    backgroundColor: color + "25",
    borderColor: color + "50",
    color: color,
  }
}

export function FilterCombobox({
  label,
  icon,
  options,
  selected,
  onSelect,
  placeholder = "Search...",
}: FilterComboboxProps) {
  const t = useTranslations("Common")
  const [open, setOpen] = useState(false)

  const selectedOptions = options.filter((o) => selected.includes(o.id))
  const hasSelected = selected.length > 0

  function toggle(id: number) {
    if (selected.includes(id)) {
      onSelect(selected.filter((s) => s !== id))
    } else {
      onSelect([...selected, id])
    }
  }

  function removeOne(id: number, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    onSelect(selected.filter((s) => s !== id))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 gap-1.5 text-xs font-normal transition-colors",
            hasSelected && "border-primary/40 bg-primary/5"
          )}
        >
          {icon && <span className="text-muted-foreground">{icon}</span>}
          {!hasSelected ? (
            <>
              <span className="text-muted-foreground">{label}</span>
              <ChevronDown className="text-muted-foreground h-3 w-3 opacity-60" />
            </>
          ) : (
            <div className="flex items-center gap-1">
              {selectedOptions.slice(0, 2).map((opt) => (
                <Badge
                  key={opt.id}
                  variant="secondary"
                  className="h-5 gap-0.5 px-1.5 py-0 text-[10px] font-medium"
                  style={opt.color ? getTagColorStyle(opt.color) : undefined}
                >
                  {opt.name}
                  <span
                    title={`Remove ${opt.name}`}
                    className="ml-0.5 opacity-60 hover:opacity-100"
                    onClick={(e) => removeOne(opt.id, e)}
                  >
                    <X className="h-2.5 w-2.5" />
                  </span>
                </Badge>
              ))}
              {selected.length > 2 && (
                <Badge
                  variant="secondary"
                  className="h-5 px-1.5 py-0 text-[10px] font-medium"
                >
                  +{selected.length - 2}
                </Badge>
              )}
            </div>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-0" align="start" sideOffset={4}>
        <Command>
          <CommandInput
            placeholder={placeholder || t("searchEllipsis")}
            className="h-8 text-xs"
          />
          <CommandList>
            <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
              {t("noResultsFound")}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.includes(option.id)
                return (
                  <CommandItem
                    key={option.id}
                    value={option.name}
                    onSelect={() => toggle(option.id)}
                    className="gap-2 text-xs"
                  >
                    <div
                      className={cn(
                        "flex h-3.5 w-3.5 items-center justify-center rounded-sm border transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/40"
                      )}
                    >
                      {isSelected && <Check className="h-2.5 w-2.5" />}
                    </div>
                    {option.color && (
                      <span
                        className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    <span className="flex-1 truncate">{option.name}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
