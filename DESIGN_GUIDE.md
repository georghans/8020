# 8020 Design Guide

A comprehensive reference for any agent building UI in this codebase. Read this before writing a single line of JSX.

---

## 1. Stack & Tooling

| Concern | Tool |
|---|---|
| Framework | Next.js 16 App Router |
| Styling | Tailwind CSS v4 (no `tailwind.config.js`) |
| Components | shadcn/ui — all in `components/ui/` |
| Icons | `lucide-react` for UI chrome; `@phosphor-icons/react` only in sidebar nav |
| Fonts | Geist Sans (`font-sans`) + Geist Mono (`font-mono`) — both loaded in `app/layout.tsx` |
| State | TanStack Query (`useQuery`) for all async data; SWR is not used |
| Theme | `next-themes` with `class` strategy; dark mode via `.dark` class |

---

## 2. Color System

The palette is defined as OKLCH CSS variables in `app/globals.css`. **Never hard-code color values.** Always use the semantic token class names.

### Light mode tokens (`:root`)
```
--background        oklch(1 0 0)               → pure white
--foreground        oklch(0.141 0.005 285.823)  → near-black with slight violet
--card              same as background
--primary           oklch(0.21 0.006 285.885)   → dark charcoal (used for headings, active nav, primary buttons)
--primary-foreground oklch(0.985 0 0)           → white
--secondary         oklch(0.967 0.001 286.375)  → near-white gray
--muted             same as secondary
--muted-foreground  oklch(0.552 0.016 285.938)  → mid gray
--accent            same as secondary
--border            oklch(0.92 0.004 286.32)    → light gray border
--input             same as border
--ring              oklch(0.705 0.015 286.067)
--sidebar           oklch(0.985 0 0)            → slightly off-white
```

### Dark mode tokens (`.dark`)
```
--background        oklch(21.34% 0 0)           → very dark gray (not pure black)
--foreground        oklch(0.985 0 0)             → white
--card              same as background
--popover           oklch(26.45% 0 0)            → slightly lighter than background (used for modals, dropdowns)
--primary           oklch(0.985 0 0)             → white (inverted from light)
--primary-foreground oklch(0.21 0.006 285.885)  → dark
--secondary         oklch(0.32 0 0)              → dark gray
--muted             oklch(0.274 0.006 286.033)
--muted-foreground  oklch(0.705 0.015 286.067)  → dimmed text
--accent            oklch(100% 0 0 / 10.2%)     → white at 10% opacity (hover states)
--border            oklch(100% 0 0 / 8%)         → white at 8% opacity
--input             oklch(0.35 0.006 286.033)
--sidebar           oklch(19% 0 0)              → darker than background
```

### Tailwind class mapping
```
bg-background        text-foreground
bg-card              text-card-foreground
bg-muted             text-muted-foreground
bg-primary           text-primary-foreground
bg-secondary         text-secondary-foreground
border-border
ring-ring
bg-accent            text-accent-foreground
bg-popover           text-popover-foreground
```

### Rules
- Use `text-primary` for emphasis elements (correspondents, active states, links with hierarchy). In light mode this renders as dark charcoal; in dark mode as white — always high contrast.
- Use `text-muted-foreground` for metadata, secondary labels, placeholders, helper text.
- Use `text-foreground` for primary body text and titles.
- Use `bg-muted/40` (40% opacity muted) for subtle hover states in table rows.
- **Never** use Tailwind color utilities like `text-white`, `bg-black`, `text-gray-500`, etc. Everything goes through tokens.
- Opacity modifiers on tokens are acceptable: `bg-primary/10`, `border-primary/40`, `text-muted-foreground/60`.

### External color injection (tags)
Tags and correspondents from Paperless carry their own hex colors. Apply them with inline `style` — do not put external hex values in Tailwind classes.

```tsx
// Tag pill using its own color
<span
  style={{ backgroundColor: tag.color, color: "#fff", border: "none" }}
  className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium leading-none"
>
  {tag.name}
</span>

// Soft tinted badge (color at 15% opacity bg, 31% border)
function getTagColorStyle(color: string): React.CSSProperties {
  return {
    backgroundColor: color + "25",
    borderColor: color + "50",
    color: color,
  }
}
```

---

## 3. Typography

### Font setup
```tsx
// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google"
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })
```
```css
/* globals.css */
--font-sans: var(--font-geist-sans);
--font-mono: var(--font-geist-mono);
```

Apply via `font-sans` (default body), `font-mono` (ASNs, code, numeric identifiers).

### Scale in use

| Role | Class |
|---|---|
| Page title | `text-2xl font-semibold tracking-tight` |
| Section label / table header | `text-xs font-medium text-muted-foreground` |
| Card title | `text-xs font-medium leading-snug` |
| Metadata row | `text-[10px] text-muted-foreground` |
| Tag pill | `text-[10px] font-medium leading-none` |
| Correspondent emphasis | `text-[11px] font-medium text-primary` |
| Body / nav items | `text-sm` |
| Action buttons in toolbar | `text-xs` |
| Mono identifiers (ASN) | `font-mono text-[10px] text-muted-foreground` |

### Rules
- Body line-height: `leading-snug` (1.375) for tight card text; `leading-relaxed` for prose.
- `line-clamp-2` for multi-line truncated titles in cards.
- `truncate` for single-line overflow in constrained containers.
- `text-balance` / `text-pretty` on headings and important copy.
- Never use a font smaller than `text-[10px]` (10px).

---

## 4. Layout Architecture

### App shell
The outer shell is assembled in `app/components/layout/layout-app.tsx`. It uses the shadcn `Sidebar` component and a sticky header. Key spacing tokens:
```css
--spacing-app-header: 56px;  /* header height */
```

### Page layout pattern
Each page sits inside the shell and owns its own vertical scroll. Use this structure:

```tsx
<div className="flex h-full flex-col">
  {/* Page header — never scrolls away */}
  <div className="flex items-center justify-between px-6 pt-6 pb-4">
    <h1 className="text-2xl font-semibold tracking-tight">Page Title</h1>
    {/* Right-side controls */}
  </div>

  {/* Sticky toolbar below header */}
  <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur
                  supports-[backdrop-filter]:bg-background/60 px-6 py-3">
    {/* Filters, search, etc. */}
  </div>

  {/* Scrollable content area */}
  <div className="flex-1 overflow-y-auto p-6">
    {/* Grid, list, etc. */}
  </div>

  {/* Optional sticky footer (pagination) */}
  <div className="flex items-center justify-center gap-1.5 border-t px-6 py-3">
    {/* Pagination */}
  </div>
</div>
```

### Grid layout (document cards)
```tsx
<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
```
Mobile-first: 2 columns → up to 6 on wide screens. Gap is always `gap-3`.

### Table layout (list view)
Use a native `<table>` with `min-w-[640px]` and `overflow-x-auto` wrapper. Column widths are fixed with `w-*` to prevent layout shift. Use `hidden md:table-cell` / `hidden sm:table-cell` for responsive column hiding.

---

## 5. Component Patterns

### Buttons
Use shadcn `Button` exclusively. Never write custom `<button>` with manual styling (sidebar `NavButton` is a legacy exception).

| Variant | When |
|---|---|
| `default` | Primary CTA, active pagination page |
| `outline` | Toolbar actions, pagination prev/next, secondary buttons |
| `ghost` | Icon-only actions (edit, preview, download), view toggles, nav items |
| `secondary` | Less common secondary actions |

Sizing in toolbars and data-dense UIs: `size="sm"` with `h-7` or `h-8` override. Icon buttons: `size="icon"` with `h-6 w-6`.

```tsx
<Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
  <Pencil className="h-3 w-3" />
</Button>
```

### View toggle (grid/list)
Wrap toggle buttons in a bordered container, use `bg-muted` on the active button:
```tsx
<div className="flex items-center gap-1 rounded-md border p-0.5">
  <Button
    variant="ghost" size="icon"
    className={cn("h-7 w-7 rounded-sm", isActive && "bg-muted text-foreground")}
  >
    <List className="h-3.5 w-3.5" />
  </Button>
</div>
```

### Segmented search bar
A single `rounded-md border` container housing an `Input` and a `DropdownMenu` trigger separated by an interior `border-l`. Never two separate bordered elements side by side.

```tsx
<div className="flex h-8 items-stretch overflow-hidden rounded-md border bg-background
                focus-within:ring-1 focus-within:ring-ring">
  <div className="relative flex items-center">
    <SearchIcon className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
    <Input className="h-full w-56 rounded-none border-0 pl-8 text-xs shadow-none
                      focus-visible:ring-0" />
  </div>
  <div className="flex items-stretch border-l">
    <DropdownMenu>...</DropdownMenu>
  </div>
</div>
```

### Filter combobox (multi-select with typeahead)
Built with `Popover` + `Command`. The trigger button shows:
- When empty: icon + label in `text-muted-foreground` + `ChevronDown`
- When populated: inline `Badge` pills (max 2 visible + overflow count), border tinted with `border-primary/40 bg-primary/5`

Individual selections are removed with an `X` inside the badge that calls `e.stopPropagation()` to prevent reopening the popover.

Checkbox inside `CommandItem`: a `div` with `border rounded-sm` that fills with `bg-primary` when selected, showing a `Check` icon.

```tsx
<div className={cn(
  "flex h-3.5 w-3.5 items-center justify-center rounded-sm border transition-colors",
  isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
)}>
  {isSelected && <Check className="h-2.5 w-2.5" />}
</div>
```

### Document card
Aspect ratio: `aspect-[3/4]` (portrait document). Tags float over the thumbnail at `top-1.5 left-1.5` with `absolute` positioning. The card body below holds correspondent (primary color, 11px), title (truncated 2 lines, 12px), and metadata rows. Action row sits in a `border-t` footer always visible (not hover-only).

```
┌─────────────────┐
│  [tag] [tag]    │  ← absolute, overlaid on image
│                 │
│    thumbnail    │  ← aspect-[3/4], object-contain
│                 │
├─────────────────┤
│ Correspondent   │  ← text-primary, 11px
│ Document title  │  ← line-clamp-2, 12px
│ 📄 Doc type     │  ← 10px, muted
│ 📅 Nov 15, 2023 │  ← 10px, muted
├─────────────────┤
│ ✏️ 👁️ ⬇️    2p  │  ← action row, border-t
└─────────────────┘
```

### Document list row
Hover shows actions: `opacity-0 group-hover:opacity-100 transition-opacity`. Row hover: `hover:bg-muted/40`. Title links: `hover:text-primary hover:underline underline-offset-2`. All actions are `h-6 w-6` ghost icon buttons.

### Modal (Dialog + Command)
Matches the chat history modal pattern exactly:
- `gap-0 overflow-hidden p-0` on `DialogContent`
- Header inside `DialogHeader` at `px-4 pt-4 pb-0`
- `Command` with `rounded-none border-none shadow-none` below a `border-t`
- Footer status bar at `border-t px-4 py-2.5` with `text-[10px] text-muted-foreground`

---

## 6. Spacing Reference

| Token | Value | Usage |
|---|---|---|
| `px-6` | 24px | Page horizontal padding |
| `py-6` / `pt-6 pb-4` | 24px / 24+16px | Page section padding |
| `py-3` | 12px | Toolbar vertical padding |
| `gap-2` / `gap-3` | 8px / 12px | Filter item gap / card grid gap |
| `gap-1.5` | 6px | Tight inline element gap |
| `gap-0.5` | 2px | Tag gap inside overlay |
| `p-2.5` | 10px | Card body padding |
| `px-3 py-2` | 12px/8px | Table cell padding |
| `h-8` | 32px | Toolbar input/button height |
| `h-7` | 28px | Toggle button, small button |
| `h-6 w-6` | 24px | Icon-only action button |

---

## 7. Transitions & Interaction

- Hover scale on card thumbnails: `transition-transform duration-300 group-hover:scale-[1.02]`
- Hover overlay on thumbnail: `bg-black/0 group-hover:bg-black/20 transition-all`
- Loading dimming of content: `opacity-60 transition-opacity` on the containing div while `isFetching`
- All border/color transitions: `transition-colors` (default 150ms)
- Never use `transform` for layout shifts or large movements
- No gradients anywhere in the UI

---

## 8. Loading & Empty States

### Skeleton loading
Use `Skeleton` from `@/components/ui/skeleton`. Mirror the exact shape of the loaded content:

```tsx
// Card grid skeleton
<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 ...">
  {Array.from({ length: PAGE_SIZE }).map((_, i) => (
    <div key={i} className="space-y-2">
      <Skeleton className="aspect-[3/4] w-full rounded-lg" />
      <Skeleton className="h-3.5 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  ))}
</div>

// List skeleton
{Array.from({ length: 12 }).map((_, i) => (
  <Skeleton key={i} className="h-10 w-full rounded-md" />
))}
```

### Empty state
Centered in the available space with `flex flex-col items-center justify-center` at `h-[50vh]`. Use a large icon at 30% opacity as a visual anchor, then a `text-base font-medium` title and `text-xs` helper text.

```tsx
<div className="flex h-[50vh] flex-col items-center justify-center text-muted-foreground">
  <FileX className="h-12 w-12 mb-3 opacity-30" />
  <p className="text-base font-medium">No documents found</p>
  <p className="text-xs mt-1">Try adjusting your search or filters</p>
</div>
```

---

## 9. Icon Usage

- All icons from `lucide-react` in UI chrome: search, navigation, actions, metadata icons
- `@phosphor-icons/react` only in `app-sidebar.tsx` — do not introduce elsewhere
- Standard sizes: `h-3 w-3` (inline/tiny), `h-3.5 w-3.5` (toolbar), `h-4 w-4` (standard), `h-5 w-5` (nav), `h-12 w-12` (empty state display icon)
- Icon color in toolbars: `text-muted-foreground`; hover: `hover:text-foreground`
- Decorative empty-state icons: `opacity-30` or `opacity-50`
- Never use emoji as icons

---

## 10. Data Fetching Pattern

```tsx
// Server component (RSC): fetch initial data
const initialData = await getDocuments(undefined, 1, 24)

// Client component: TanStack Query for interactivity
const { data, isLoading, isFetching } = useQuery({
  queryKey: ["documents", filters, page],
  queryFn: () => getDocuments(filters, page, PAGE_SIZE),
  initialData: page === 1 && !hasActiveFilters ? initialData : undefined,
  placeholderData: (previousData) => previousData,  // prevents flash on page change
})
```

- `initialData` from the RSC avoids a loading flash on first paint
- `placeholderData` keeps previous data visible during page transitions (dimmed with `opacity-60`)
- `staleTime: 5 * 60 * 1000` (5 min) for reference data like tags and document types
- Use `useDebounce(value, 300)` before passing text search to the query key to avoid excessive requests

---

## 11. API Route Pattern (Paperless Proxy)

```ts
// app/api/documents/tags/route.ts
import { paperlessFetch } from "@/lib/paperless-tools"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const data = await paperlessFetch("/api/tags/?page_size=500")
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
```

All external Paperless calls go through `paperlessFetch` from `@/lib/paperless-tools` — never use `fetch` directly with external URLs in components or routes.

---

## 12. Pagination Pattern

Two-level pagination: a compact count + prev/next in the sticky toolbar row, and a full prev/next + numbered pages in the footer. Page numbers show a sliding window of 5 around the current page:

```tsx
// Sliding window of 5 page numbers
Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
  let pageNum: number
  if (totalPages <= 5)          pageNum = i + 1
  else if (page <= 3)           pageNum = i + 1
  else if (page >= totalPages - 2) pageNum = totalPages - 4 + i
  else                          pageNum = page - 2 + i
  return pageNum
})
```

Active page: `variant="default"`. Inactive: `variant="outline"`. All `h-7 w-7 p-0 text-xs`. Navigation buttons include a word label ("Prev" / "Next") + icon, sized `h-7 gap-1 text-xs px-2`.

---

## 13. Accessibility

- All `<img>` tags must have descriptive `alt` text (use document title)
- Icon-only `Button` elements must have `title` prop
- `sr-only` for screen-reader-only labels on ambiguous icon buttons
- Use semantic HTML: `<table>`, `<thead>`, `<th>`, `<tbody>`, `<tr>`, `<td>` for tabular data — never a div grid
- `<a>` with `asChild` on `Button` for navigation actions (edit, preview, download) — never `onClick` + `router.push` for downloadable/external URLs
- Disabled controls during fetch: `disabled={isFetching}` on pagination buttons

---

## 14. File Conventions

```
app/
  [feature]/
    page.tsx              ← RSC, fetches initial data, minimal markup
    [feature]-view.tsx    ← "use client" orchestrating component with all state
    [sub-component].tsx   ← "use client" leaf components
  api/
    [resource]/
      route.ts            ← thin proxy; always try/catch; return NextResponse.json
components/
  ui/                     ← shadcn components only; never edit these directly
lib/
  [domain]/
    api.ts                ← typed fetch wrappers using paperlessFetch; use `cache()`
```

- One state-owning `*-view.tsx` per page route. Never co-locate complex state in `page.tsx`.
- Sub-components receive typed props, own zero async logic, import from `@/lib/*/api` types only.
- All API lib functions use Next.js `cache()` for deduplication.
