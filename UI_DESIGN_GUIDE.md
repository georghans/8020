# UI Design Guide
### How to build beautiful, polished, production-quality UI with shadcn/ui and Tailwind CSS.
### Read this before writing any JSX.

---

## Philosophy

Great UI is structural, not decorative. Beauty comes from constraint, consistency, and hierarchy — not from colors, gradients, or animations. Every element must earn its place by communicating information or enabling action. If removing something does not break comprehension, remove it.

**Four principles:**

1. **Restraint over decoration.** No gradients for depth. No shadows for elevation. No animations for life. Ornamentation is noise.
2. **Hierarchy through contrast, not color.** Guide the eye with size and weight contrast. A clear path from title → content → metadata does not need a rainbow palette.
3. **Density without crowding.** Information-dense UIs feel spacious because whitespace is *consistent*, not generous. Use the spacing scale. Never eyeball padding.
4. **Predictability over cleverness.** Users must never be surprised by where a control is or what it does. Follow shadcn conventions. If a pattern already exists in the codebase, match it exactly.

---

## Color

### The Rule
**Use semantic tokens exclusively. Never use Tailwind's color scale (`text-gray-500`, `bg-zinc-900`) or hard-coded values (`text-white`, `#1a1a1a`) in component code.**

Every shadcn project ships a set of CSS variable tokens. Use only those:

| Use | Token |
|---|---|
| Page/card background | `bg-background` |
| Primary text | `text-foreground` |
| Secondary/metadata text | `text-muted-foreground` |
| Subtle fill (table headers, inactive tabs) | `bg-muted` |
| Hover fill | `bg-accent` |
| Brand/emphasis color | `bg-primary` / `text-primary` |
| Card surface | `bg-card` |
| Floating surfaces (dropdowns, modals) | `bg-popover` |
| Dividers and input borders | `border-border` |
| Destructive actions | `text-destructive` / `bg-destructive` |

### Opacity modifiers
Opacity modifiers on tokens are allowed and encouraged for nuance:
```
bg-primary/10      — tinted highlight fill on selected items
bg-muted/40        — row hover (softer than full muted)
text-muted-foreground/60   — even more dimmed metadata
border-primary/30  — tinted border on active filters
```

### Dynamic / external colors
When an item has its own color from an API (tags, labels, status), inject it with `style={{}}` — never with Tailwind arbitrary values like `bg-[#abc]`.

```tsx
// Solid pill — high contrast, good for thumbnails
<span
  style={{ backgroundColor: color, color: "#fff" }}
  className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium leading-none"
>
  {name}
</span>

// Soft tinted pill — professional, good in dense lists
<span
  style={{
    backgroundColor: `${color}22`,   // 13% alpha
    borderColor:     `${color}55`,   // 33% alpha
    color:           color,
  }}
  className="inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[10px] font-medium"
>
  {name}
</span>
```

### Dark mode
- Never write `dark:text-white` or `dark:bg-black` manually. If you need that, it means you used a non-token class upstream — fix the root cause.
- The token system handles dark mode automatically when configured correctly in `globals.css`.
- The only acceptable `dark:` usage is for structural differences unrelated to color.

---

## Typography

### The Scale
Use only these classes. Do not invent intermediate sizes like `text-[13px]`.

| Role | Classes |
|---|---|
| Page title | `text-2xl font-semibold tracking-tight text-balance` |
| Section heading | `text-base font-semibold` |
| Group label / column header | `text-xs font-medium text-muted-foreground uppercase tracking-wide` |
| Body / description | `text-sm leading-relaxed text-pretty` |
| UI label (buttons, form labels) | `text-sm font-medium` |
| Table cell | `text-sm` |
| Metadata (dates, counts) | `text-xs text-muted-foreground` |
| Micro label (tags, badges, ASNs) | `text-[10px] font-medium leading-none` |
| Numeric identifier | `font-mono text-xs text-muted-foreground` |

### Rules

**Weight:** `font-semibold` is the maximum weight in UI chrome. Never use `font-bold` (700) for headings or labels — it looks heavy and amateurish in modern UIs. Reserve bold for marketing copy only.

**Tracking:**
- `tracking-tight` on headings `text-xl` and above
- `tracking-wide` only on ALL-CAPS micro labels
- Never use `tracking-widest` — it cheapens the look

**Line height:**
- `leading-none` — pill labels, badges only
- `leading-snug` — card titles, dense UI labels
- `leading-normal` — default UI
- `leading-relaxed` — body prose, descriptions

**Long text:**
- Add `text-balance` to all headlines (prevents awkward single-word last lines)
- Add `text-pretty` to multi-sentence descriptions (avoids orphaned words)
- Add `max-w-prose` to flowing paragraphs to cap line length at ~65 chars

**Numbers:** Use `font-mono` for any number users need to compare (counts, IDs, prices). Proportional digits in a list cause visual jitter when scanning.

**Truncation:**
- `truncate` — single-line, constrained containers
- `line-clamp-2` / `line-clamp-3` — titles and descriptions in cards
- Always pair `line-clamp-*` with a `title={fullText}` attribute for tooltip fallback

---

## Spacing & Density

Use only Tailwind's 4px-step scale. Arbitrary values (`p-[14px]`, `mt-[7px]`) are banned.

### Permitted Values
```
0.5 → 2px    gap in tight inline elements, icon nudges
1   → 4px    badge internal padding
1.5 → 6px    pill gaps, tight inline spacing
2   → 8px    button internal gap, item spacing in a row
2.5 → 10px   card body padding
3   → 12px   card grid gap, section row gap
4   → 16px   standard form field gap, element gap
5   → 20px   section internal padding
6   → 24px   page horizontal padding, major section gap
8   → 32px   large section separator
12  → 48px   page top padding
```

### Sizing Conventions
| Element | Height | Padding |
|---|---|---|
| Toolbar button | `h-8` | `px-2.5 py-1.5` |
| Form input | `h-9` | `px-3 py-2` (handled by shadcn) |
| Compact toolbar input | `h-8` | same |
| Prominent search bar | `h-11` | same |
| Small icon button | `h-6 w-6` | `p-1` |
| Dense toolbar icon button | `h-7 w-7` | — |
| Standard icon button | `h-9 w-9` (`size="icon"`) | — |
| Table cell | — | `px-3 py-2` |
| Card body | — | `p-2.5` or `p-3` |
| Page section gap | — | `gap-6` |
| Card grid gap | — | `gap-3` |

### The Golden Rule
**Never let interactive elements touch.** Every interactive element needs at minimum `gap-2` from its neighbors. When in doubt, add space — crowding signals low quality.

### `gap` vs `margin` vs `space-x`
- Use `gap-*` on flex/grid containers for spacing between children. Always.
- Never use `space-x-*` or `space-y-*` — they apply margin and break with wrapping flex rows.
- Use `mt-*` / `mb-*` only for vertical rhythm between distinct content blocks, not between sibling components in a flex layout.

---

## Layout

### Page Layout Pattern
Every full-page view follows this exact structure:

```tsx
<div className="flex h-full flex-col">

  {/* 1. Page header */}
  <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-balance">Title</h1>
      <p className="text-xs text-muted-foreground mt-0.5">Subtitle or count</p>
    </div>
    <div className="flex items-center gap-2">{/* Top-right actions */}</div>
  </div>

  {/* 2. Sticky toolbar */}
  <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur
                  supports-[backdrop-filter]:bg-background/60 px-6 py-3 shrink-0">
    <div className="flex items-center gap-2 flex-wrap">
      {/* Search, filters */}
    </div>
  </div>

  {/* 3. Scrollable content — min-h-0 is critical */}
  <div className="flex-1 overflow-y-auto min-h-0 p-6">
    {/* Grid or table */}
  </div>

  {/* 4. Sticky footer */}
  <div className="flex items-center justify-between border-t px-6 py-3 shrink-0">
    {/* Pagination */}
  </div>

</div>
```

`min-h-0` on the scroll area is **mandatory** inside a flex column — without it the browser will not constrain the area and the footer escapes the viewport.

### Grid Columns
```tsx
// Portrait cards (documents, images)
<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">

// Dashboard tiles
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

// Settings / form + sidebar
<div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
```

### Tables
Use native `<table>` elements inside an overflow wrapper. Never use a CSS grid to simulate a table.

```tsx
<div className="overflow-x-auto rounded-md border">
  <table className="w-full min-w-[640px]">
    <thead>
      <tr className="border-b bg-muted/50">
        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
          Title
        </th>
      </tr>
    </thead>
    <tbody>
      <tr className="group border-b hover:bg-muted/40 transition-colors">
        <td className="px-3 py-2 text-sm">...</td>
      </tr>
    </tbody>
  </table>
</div>
```

Column order: **Title → Relationship → Classification → Date → Actions**. Actions always last, fixed width, right-aligned. Use `hidden md:table-cell` to hide columns at small viewports.

### Responsive Strategy
Mobile-first. Always. Enhance for larger screens with `sm:`, `md:`, `lg:`, `xl:` — never shrink from desktop-first.

---

## Elevation & Depth

**Do not use shadows for depth.** This design system uses border contrast and background layering instead.

### Surface Stack
```
Page background     bg-background        base
────────────────────────────────────────────────
Cards               bg-card + border     layer 1
Sticky toolbars     bg-background/95     layer 1
────────────────────────────────────────────────
Dropdowns/Popovers  bg-popover           layer 2
Modals/Dialogs      bg-background        layer 2
────────────────────────────────────────────────
Tooltips            bg-popover           layer 3
```

### Cards
```tsx
// Standard
<div className="bg-card border border-border rounded-lg overflow-hidden">

// Interactive
<div className="bg-card border border-border rounded-lg overflow-hidden
                hover:border-border/80 transition-colors cursor-pointer">
```

No `shadow-*` classes on cards. The border creates enough separation.

### Sticky Toolbar Frosting
```
bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
```

### Border Radius Scale
- `rounded-sm` — micro elements: checkboxes, small badges
- `rounded` — pills, tags, inline badges
- `rounded-md` — inputs, buttons, dropdowns, small cards
- `rounded-lg` — cards, modals, larger containers
- `rounded-xl` — featured/hero cards only
- `rounded-full` — avatars and circular icon buttons only. Never on rectangles.

---

## Component Patterns

### Buttons
Use shadcn `Button` exclusively.

| Variant | Use |
|---|---|
| `default` | Primary CTA, submit, active pagination page |
| `outline` | Secondary actions, pagination prev/next, cancel |
| `ghost` | Icon actions, row hover actions, nav items |
| `secondary` | Tertiary visible actions |
| `destructive` | Delete, remove, irreversible actions only |
| `link` | Inline text links in prose only |

**Sizing:**
- `size="default"` (`h-10`) — prominent page-level CTAs only
- `size="sm"` (`h-8`) — toolbars, filters, card actions
- `size="icon"` (`h-9 w-9`) — standard icon buttons
- `h-7 w-7` custom — dense toolbar icon buttons
- `h-6 w-6` custom — row-level micro actions

### Segmented Search Bar
One bordered container, never two adjacent bordered elements:

```tsx
<div className="flex h-8 items-stretch overflow-hidden rounded-md border bg-background
                focus-within:ring-1 focus-within:ring-ring transition-shadow">
  <div className="relative flex items-center flex-1">
    <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
    <Input
      className="h-full border-0 rounded-none pl-8 text-xs shadow-none
                 focus-visible:ring-0 bg-transparent"
      placeholder="Search..."
    />
  </div>
  {/* Mode dropdown separated by interior border */}
  <div className="flex items-stretch border-l">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm"
          className="h-full rounded-none px-2.5 text-xs gap-1.5 text-muted-foreground hover:text-foreground">
          Mode <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  </div>
</div>
```

Two separate bordered inputs side-by-side create a double-border artifact. One container unifies them.

### View Toggle (Grid / List)
```tsx
<div className="flex items-center rounded-md border p-0.5">
  {[{ view: "grid", icon: LayoutGrid }, { view: "list", icon: List }].map(({ view, icon: Icon }) => (
    <Button key={view} variant="ghost" size="icon"
      className={cn("h-7 w-7 rounded-sm",
        currentView === view ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
    </Button>
  ))}
</div>
```

### Multi-Select Filter Combobox
Built with `Popover` + `Command`. The trigger changes appearance when selections are active:

```tsx
// Empty — muted text
<Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground">
  <FilterIcon className="h-3.5 w-3.5" /> Label <ChevronDown className="h-3 w-3 opacity-50" />
</Button>

// Active — tinted border + badge pills
<Button variant="outline" size="sm"
  className="h-8 gap-1 text-xs border-primary/40 bg-primary/5 text-foreground">
  <FilterIcon className="h-3.5 w-3.5 text-primary" />
  {selected.slice(0, 2).map(item => (
    <Badge key={item.id} variant="secondary" className="h-4 gap-0.5 px-1 text-[10px] font-normal">
      {item.name}
      <X className="h-2.5 w-2.5 cursor-pointer" onClick={e => { e.stopPropagation(); remove(item) }} />
    </Badge>
  ))}
  {selected.length > 2 && (
    <Badge variant="secondary" className="h-4 px-1 text-[10px]">+{selected.length - 2}</Badge>
  )}
</Button>

// Command item with custom checkbox
<CommandItem onSelect={() => toggle(item)} className="gap-2">
  <div className={cn(
    "flex h-3.5 w-3.5 items-center justify-center rounded-sm border transition-colors shrink-0",
    isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
  )}>
    {isSelected && <Check className="h-2.5 w-2.5" />}
  </div>
  <span className="text-sm truncate">{item.name}</span>
  <span className="ml-auto text-xs text-muted-foreground">{item.count}</span>
</CommandItem>
```

### Command / Search Modal
```tsx
<Dialog>
  <DialogContent className="gap-0 overflow-hidden p-0 max-w-2xl">
    <DialogHeader className="px-4 pt-4 pb-3 border-b">
      <DialogTitle className="text-sm font-medium">Search</DialogTitle>
    </DialogHeader>
    <Command className="rounded-none border-none shadow-none">
      <CommandInput placeholder="Type to search..." className="h-11 text-sm" />
      <CommandList className="max-h-[400px]">
        <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
          No results.
        </CommandEmpty>
        <CommandGroup heading="Results">
          <CommandItem>...</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
    <div className="border-t px-4 py-2.5">
      <p className="text-[10px] text-muted-foreground">Keyboard hint or status</p>
    </div>
  </DialogContent>
</Dialog>
```

### Pagination
```tsx
// Sliding window of 5 pages centered on current
const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
  if (totalPages <= 5) return i + 1
  if (currentPage <= 3) return i + 1
  if (currentPage >= totalPages - 2) return totalPages - 4 + i
  return currentPage - 2 + i
})

// Render: active page uses variant="default", rest use variant="outline"
// All buttons: h-7 w-7 text-xs
// Prev/Next: h-7 px-2 gap-1 text-xs with icon + word label
```

---

## Interaction & Motion

### The Rule
**Every animation must be functional.** It either communicates a state change, provides spatial context, or reduces perceived latency. Animations that exist purely to look "alive" are banned.

### Duration Standards
| Interaction | Duration | Easing |
|---|---|---|
| Hover color/border change | `duration-150` | `ease-in-out` |
| Popover/dropdown open | `duration-200` | `ease-out` |
| Modal open/close | `duration-300` | `ease-in-out` |
| Card hover scale | `duration-200` | `ease-out` |
| Opacity reveal (row actions) | `duration-150` | `ease-in-out` |
| Page transition | none | — |

Never use `duration-500` or longer for UI interactions — long animations feel broken.

### Key Patterns
```tsx
// Card thumbnail hover
<div className="group overflow-hidden ...">
  <div className="relative overflow-hidden">
    <img className="transition-transform duration-200 group-hover:scale-[1.02]" />
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-200" />
  </div>
</div>

// Row hover actions revealed on hover
<tr className="group hover:bg-muted/40 transition-colors">
  <td>
    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-6 w-6">...</Button>
    </div>
  </td>
</tr>

// Dim content during background refetch
<div className={cn("transition-opacity duration-200", isFetching && "opacity-60 pointer-events-none")}>
  {children}
</div>
```

### Specific Properties Only
```tsx
// CORRECT — specific
transition-colors   transition-transform   transition-opacity   transition-shadow

// WRONG — catches everything, expensive and unpredictable
transition-all
```

---

## Loading, Empty & Error States

### Skeleton Loading
Skeletons must mirror the exact shape of the loaded content. Match the count to `pageSize` to prevent layout shift.

```tsx
// Card grid skeleton
{Array.from({ length: pageSize }).map((_, i) => (
  <div key={i} className="space-y-1.5">
    <Skeleton className="aspect-[3/4] w-full rounded-lg" />
    <Skeleton className="h-3 w-2/3" />
    <Skeleton className="h-3 w-1/2" />
    <Skeleton className="h-2.5 w-1/3" />
  </div>
))}

// Table row skeleton
{Array.from({ length: pageSize }).map((_, i) => (
  <tr key={i} className="border-b">
    <td className="px-3 py-2"><Skeleton className="h-4 w-48" /></td>
    <td className="px-3 py-2"><Skeleton className="h-4 w-24" /></td>
    <td className="px-3 py-2"><Skeleton className="h-4 w-20" /></td>
  </tr>
))}
```

### Empty States
Three types — each slightly different:

```tsx
// 1. Collection genuinely empty
<div className="flex h-[50vh] flex-col items-center justify-center gap-3 text-center">
  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
    <FileX className="h-7 w-7 text-muted-foreground" />
  </div>
  <div>
    <p className="text-sm font-medium">No items yet</p>
    <p className="text-xs text-muted-foreground mt-1 max-w-xs text-pretty">
      Items will appear here once they are added.
    </p>
  </div>
  <Button size="sm" variant="outline">Get started</Button>
</div>

// 2. Search returned nothing
<div className="flex h-[40vh] flex-col items-center justify-center gap-2 text-center">
  <Search className="h-10 w-10 text-muted-foreground/30" />
  <p className="text-sm font-medium">No results found</p>
  <p className="text-xs text-muted-foreground">Try adjusting your search or removing filters</p>
  <Button size="sm" variant="ghost" onClick={clearFilters} className="text-xs mt-1">
    Clear all filters
  </Button>
</div>

// 3. Fetch error
<div className="flex h-[40vh] flex-col items-center justify-center gap-2">
  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
    <AlertCircle className="h-6 w-6 text-destructive" />
  </div>
  <p className="text-sm font-medium">Failed to load</p>
  <p className="text-xs text-muted-foreground">Something went wrong. Please try again.</p>
  <Button size="sm" variant="outline" onClick={retry}>Retry</Button>
</div>
```

---

## Icons

### Size Scale
| Context | Class |
|---|---|
| Inline with micro text (10–12px) | `h-2.5 w-2.5` or `h-3 w-3` |
| Toolbar / filter | `h-3.5 w-3.5` |
| Standard UI | `h-4 w-4` |
| Section heading / sidebar nav | `h-5 w-5` |
| Empty state | `h-7 w-7` to `h-12 w-12` |

### Color Rules
- Toolbar icons: `text-muted-foreground hover:text-foreground`
- Icons inside `Button ghost`: inherit from button
- Decorative / empty-state icons: `text-muted-foreground opacity-30`
- Status icons (error, success): `text-destructive` / `text-green-500` — the only non-token colors allowed, for universal semantic meaning

### Icon-Only Buttons
Every icon-only button must have both a `title` prop (tooltip) and `sr-only` text:

```tsx
<Button variant="ghost" size="icon" className="h-6 w-6" title="Delete item">
  <Trash2 className="h-3 w-3" />
  <span className="sr-only">Delete item</span>
</Button>
```

---

## Forms

### Anatomy
```tsx
<div className="space-y-2">
  <Label htmlFor="field-id" className="text-sm font-medium">Field Label</Label>
  <Input id="field-id" placeholder="Placeholder..." className="h-9 text-sm" />
  <p className="text-xs text-muted-foreground">Helper text.</p>
</div>
```

Always pair `<Label htmlFor>` with a matching input `id`. Never use a div as a label.

### Sizing
- `h-9` — standard form inputs inside panels and cards
- `h-8` — compact toolbar inputs
- `h-11` — prominent page-level search

### Validation
```tsx
<Input className={cn(hasError && "border-destructive focus-visible:ring-destructive")} />
{hasError && <p className="text-xs text-destructive mt-1">{errorMessage}</p>}
```

### Layout
```tsx
// Single column
<form className="space-y-4">

// Two column
<form className="grid grid-cols-1 gap-4 md:grid-cols-2">
  <div className="md:col-span-2">Full-width field</div>
</form>
```

### Textarea
```tsx
<Textarea className="min-h-[80px] resize-y text-sm" />
```
Always set `min-h-[*]`. Use `resize-y` only — never `resize` (breaks layouts horizontally) or `resize-none` (frustrates users).

---

## Accessibility

Accessibility is a quality signal, not a checklist. If something is hard to use with a keyboard, it is probably confusing for mouse users too.

- `<h1>` once per page. Never skip heading levels.
- Use `<table>` for tabular data, `<button>` for actions, `<a>` for navigation. Never swap them.
- Every icon-only button needs `title` + `<span className="sr-only">`.
- Every image needs `alt`. Decorative images: `alt="" role="presentation"`.
- Never suppress focus rings. `outline-none focus:outline-none` without a replacement is banned.
- Never rely on color alone to communicate state — always add an icon or label.
- Live regions for dynamic counts: `<div aria-live="polite">{count} results</div>`

---

## The Anti-Pattern Reference

These produce bad UI. They are banned.

### Colors
```tsx
// WRONG
<div className="bg-white text-black border-gray-200">
<p className="text-gray-500">
<div className="bg-slate-50 dark:bg-zinc-900">

// CORRECT
<div className="bg-background text-foreground border-border">
<p className="text-muted-foreground">
```

### Spacing
```tsx
// WRONG
<div className="p-[14px] mt-[7px] gap-[11px]">
<div className="flex space-x-4">   // space-x adds margin; breaks with flex-wrap

// CORRECT
<div className="p-3 mt-2 gap-3">
<div className="flex gap-4">
```

### Layout
```tsx
// WRONG — flex column without min-h-0 on scroll child
<div className="flex flex-col h-full">
  <div className="overflow-y-auto">  {/* will NOT scroll */}

// CORRECT
<div className="flex flex-col h-full">
  <div className="shrink-0">header</div>
  <div className="flex-1 overflow-y-auto min-h-0">content</div>
</div>
```

### Typography
```tsx
// WRONG
<h2 className="font-bold">           // too heavy
<p className="text-[13px]">          // off-scale
<span className="uppercase text-xs"> // missing tracking

// CORRECT
<h2 className="font-semibold">
<p className="text-xs"> or <p className="text-sm">
<span className="text-xs uppercase tracking-wide">
```

### Motion
```tsx
// WRONG
<div className="transition-all duration-500 hover:rotate-3 hover:scale-110">
<div className="animate-bounce">   // purely decorative

// CORRECT
<div className="transition-colors duration-150 hover:bg-accent">
```

### Shadows & Gradients
```tsx
// WRONG
<div className="shadow-md rounded-lg">
<div className="bg-gradient-to-r from-blue-500 to-purple-600">

// CORRECT
<div className="border border-border rounded-lg">
<div className="bg-primary">
```

### Buttons
```tsx
// WRONG — raw button element
<button className="px-4 py-2 bg-blue-600 text-white rounded">

// WRONG — emoji as icon
<button>📄 Download</button>

// CORRECT
<Button variant="default">Submit</Button>
<Button variant="ghost" size="icon" title="Download"><Download className="h-4 w-4" /></Button>
```

### Data Fetching
```tsx
// WRONG
useEffect(() => {
  fetch("/api/data").then(r => r.json()).then(setData)
}, [])

// WRONG — search fires on every keystroke
queryKey: ["items", searchInput]

// CORRECT
const debouncedSearch = useDebounce(searchInput, 300)
const { data } = useQuery({ queryKey: ["items", debouncedSearch], queryFn: ... })
```

---

## Pre-Ship Checklist

Run through this before marking any component complete:

```
[ ] All colors use semantic tokens — no text-gray-*, bg-white, bg-zinc-*
[ ] No arbitrary spacing ([14px], [7px]) — use the 4px scale
[ ] flex gap-* for spacing, not space-x-* or margins between siblings
[ ] flex flex-col h-full with min-h-0 on scroll areas
[ ] Skeleton count matches pageSize — no layout shift on load
[ ] Empty state exists for zero-result scenarios
[ ] Error state exists for failed fetches
[ ] All icon-only buttons have title + sr-only text
[ ] All images have meaningful alt text
[ ] Search input debounced at 300ms
[ ] No useEffect for data fetching — use TanStack Query or SWR
[ ] Tables use semantic <table> HTML, not CSS grid
[ ] Dark mode verified — no hard-coded white or black
[ ] No shadow-* classes — use border for depth
[ ] No decorative gradients — solid colors only
[ ] transition-colors / transition-opacity — not transition-all
[ ] font-semibold maximum weight in UI chrome
[ ] text-[10px] minimum font size
[ ] Dynamic hex colors use style={{}}, not arbitrary Tailwind bg-[#hex]
[ ] No rounded-full on rectangular elements
```
