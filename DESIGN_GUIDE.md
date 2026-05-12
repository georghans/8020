# 8020 Design Guide
### The definitive reference for building beautiful, polished, production-quality UI in this codebase.
### Read this before writing a single line of JSX.

---

## Table of Contents

1. [Philosophy & First Principles](#1-philosophy--first-principles)
2. [Stack & Tooling](#2-stack--tooling)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Spacing & Density](#5-spacing--density)
6. [Layout Architecture](#6-layout-architecture)
7. [Elevation, Depth & Surfaces](#7-elevation-depth--surfaces)
8. [Component Patterns](#8-component-patterns)
9. [Interaction & Motion](#9-interaction--motion)
10. [Loading, Empty & Error States](#10-loading-empty--error-states)
11. [Icons](#11-icons)
12. [Forms & Inputs](#12-forms--inputs)
13. [Data Display](#13-data-display)
14. [Data Fetching Pattern](#14-data-fetching-pattern)
15. [Accessibility](#15-accessibility)
16. [Dark Mode](#16-dark-mode)
17. [File & Code Conventions](#17-file--code-conventions)
18. [The Anti-Pattern Reference](#18-the-anti-pattern-reference)

---

## 1. Philosophy & First Principles

Great UI is not decoration added at the end. It is a structural property of how components are composed, spaced, and constrained. Every design decision below follows from four principles:

**1. Restraint over decoration.**
Remove everything that does not directly communicate information or action. No gradients for the sake of depth. No shadows for the sake of elevation. No animations for the sake of life. Every element earns its place.

**2. Hierarchy through contrast, not color.**
A user's eye should travel the page in a predictable path: page title → toolbar → primary content → metadata. Achieve this with size contrast, weight contrast, and opacity contrast — not with rainbow palettes.

**3. Density without crowding.**
Good information-dense UIs feel spacious because whitespace is applied consistently, not randomly. Use the spacing scale religiously. Never eyeball padding.

**4. Predictability over cleverness.**
Users should never be surprised by where a control is or what it does. Follow established shadcn/HTML conventions. If a pattern already exists in this codebase, match it exactly.

---

## 2. Stack & Tooling

| Concern | Tool |
|---|---|
| Framework | Next.js 16 App Router |
| Styling | Tailwind CSS v4 (no `tailwind.config.js`) |
| Components | shadcn/ui — all in `components/ui/` |
| Icons | `lucide-react` for all UI chrome; `@phosphor-icons/react` only in sidebar nav |
| Fonts | Geist Sans (`font-sans`) + Geist Mono (`font-mono`) — both loaded in `app/layout.tsx` |
| State | TanStack Query (`useQuery`) for all async data |
| Theme | `next-themes` with `class` strategy; dark mode via `.dark` class on `<html>` |
| Utilities | `clsx` + `tailwind-merge` via the `cn()` helper from `@/lib/utils` |

### The `cn()` helper
Always use `cn()` for conditional class application. Never concatenate class strings with template literals.

```tsx
// Correct
<div className={cn("base-classes", condition && "conditional-class", variant === "x" && "x-class")} />

// Wrong
<div className={`base-classes ${condition ? "conditional-class" : ""}`} />
```

---

## 3. Color System

The palette is defined as OKLCH CSS variables in `app/globals.css`. **Never hard-code color values. Never use Tailwind color scale classes like `text-gray-500` or `bg-zinc-900`.**

### Why OKLCH?
OKLCH is perceptually uniform — the same `L` (lightness) value looks equally bright across all hues. This means token swaps between light and dark mode produce visually consistent results.

### Full Token Reference

#### Light mode (`:root`)
| Token | Value | Role |
|---|---|---|
| `--background` | `oklch(1 0 0)` | Page / card background |
| `--foreground` | `oklch(0.141 0.005 285.823)` | Primary text |
| `--card` | same as background | Card surface |
| `--card-foreground` | same as foreground | Card text |
| `--popover` | same as background | Dropdown / modal surface |
| `--popover-foreground` | same as foreground | Dropdown text |
| `--primary` | `oklch(0.21 0.006 285.885)` | Dark charcoal — active, emphasis, links |
| `--primary-foreground` | `oklch(0.985 0 0)` | White — text on primary bg |
| `--secondary` | `oklch(0.967 0.001 286.375)` | Near-white gray — subtle fills |
| `--secondary-foreground` | `oklch(0.21 0.006 285.885)` | Dark — text on secondary |
| `--muted` | same as secondary | Low-emphasis fill |
| `--muted-foreground` | `oklch(0.552 0.016 285.938)` | Mid-gray — metadata, placeholders |
| `--accent` | same as secondary | Hover state fill |
| `--accent-foreground` | same as secondary-foreground | Text on accent |
| `--border` | `oklch(0.92 0.004 286.32)` | Dividers, input borders |
| `--input` | same as border | Input border |
| `--ring` | `oklch(0.705 0.015 286.067)` | Focus ring |
| `--sidebar` | `oklch(0.985 0 0)` | Sidebar surface |

#### Dark mode (`.dark`)
| Token | Value | Role |
|---|---|---|
| `--background` | `oklch(21.34% 0 0)` | Very dark gray (not pure black) |
| `--foreground` | `oklch(0.985 0 0)` | White |
| `--popover` | `oklch(26.45% 0 0)` | Slightly lighter — dropdowns, modals |
| `--primary` | `oklch(0.985 0 0)` | White (inverted from light) |
| `--primary-foreground` | `oklch(0.21 0.006 285.885)` | Dark |
| `--secondary` | `oklch(0.32 0 0)` | Dark gray fill |
| `--muted` | `oklch(0.274 0.006 286.033)` | Subtle dark fill |
| `--muted-foreground` | `oklch(0.705 0.015 286.067)` | Dimmed text |
| `--accent` | `oklch(100% 0 0 / 10.2%)` | White at 10% — hover fill |
| `--border` | `oklch(100% 0 0 / 8%)` | White at 8% — very subtle dividers |
| `--input` | `oklch(0.35 0.006 286.033)` | Input border |
| `--sidebar` | `oklch(19% 0 0)` | Slightly darker than background |

### Semantic Usage Rules

**For text:**
- `text-foreground` — primary content, titles, names
- `text-muted-foreground` — metadata, dates, helper text, column headers, placeholders
- `text-primary` — emphasis items, active nav links, correspondent names, clickable titles
- `text-card-foreground` — inside card surfaces (usually same as foreground)

**For backgrounds:**
- `bg-background` — page canvas, card bodies, popovers (when inside card)
- `bg-popover` — floating elements: dropdowns, command menus, tooltips
- `bg-muted` — table headers, inactive tabs, secondary areas
- `bg-muted/40` — row hover states (half-opacity for subtlety)
- `bg-primary/5` or `bg-primary/10` — tinted highlight fill on selected items
- `bg-accent` — hover fill on ghost buttons and list items

**For borders:**
- `border-border` — default dividers, card outlines, input borders
- `border-primary/40` — tinted border on selected/active filter elements
- `border-input` — form input borders specifically

**Opacity modifiers are allowed:**
```
bg-primary/10     bg-muted/40     text-muted-foreground/60     border-primary/30
```

### External/Dynamic Colors (Tags, Correspondents)
When rendering items with their own hex colors from the API, use inline `style` — never Tailwind classes with arbitrary values like `bg-[#abc123]`.

```tsx
// Full-color solid pill (high contrast)
<span
  style={{ backgroundColor: tag.color, color: "#fff" }}
  className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium leading-none"
>
  {tag.name}
</span>

// Soft tinted pill (low contrast, professional look)
<span
  style={{
    backgroundColor: `${tag.color}22`,  // hex + 2-digit alpha (13%)
    borderColor: `${tag.color}55`,       // hex + 2-digit alpha (33%)
    color: tag.color,
  }}
  className="inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[10px] font-medium"
>
  {tag.name}
</span>
```

The soft tinted style (`22`/`55` alpha suffixes) is preferred in list views where many tags appear together. The solid style is preferred in card thumbnails where contrast against imagery is needed.

---

## 4. Typography

### Font Setup
```tsx
// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google"
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })
// Apply both className variables to <html>
```
```css
/* globals.css — configure in @theme inline block */
--font-sans: var(--font-geist-sans);
--font-mono: var(--font-geist-mono);
```

### The Complete Type Scale

| Role | Tailwind Classes | Notes |
|---|---|---|
| Page title | `text-2xl font-semibold tracking-tight` | One per page, always `text-balance` |
| Section heading | `text-base font-semibold` | Within content areas |
| Subsection label | `text-xs font-medium text-muted-foreground uppercase tracking-wide` | Column headers, group labels |
| Body text | `text-sm leading-relaxed` | Paragraphs, descriptions |
| UI label | `text-sm font-medium` | Button text, form labels |
| Card title | `text-xs font-medium leading-snug` | Constrained title in card |
| Table cell | `text-sm` | Default table data |
| Metadata | `text-xs text-muted-foreground` | Dates, counts, secondary info |
| Micro metadata | `text-[10px] text-muted-foreground` | Tags, ASNs, tiny labels |
| Tag pill | `text-[10px] font-medium leading-none` | Inside colored badges |
| Mono identifier | `font-mono text-[10px] text-muted-foreground` | ASNs, IDs, serial numbers |
| Code | `font-mono text-sm bg-muted px-1 py-0.5 rounded` | Inline code |

### Typography Rules

**Hierarchy:** Use size AND weight together. A large-but-thin title is weak. A small-but-bold subtitle creates false hierarchy.

**Tracking:**
- `tracking-tight` on headings `text-xl` and above — tightens the large text
- `tracking-wide` only on ALL-CAPS micro labels — increases readability at small size
- Never use `tracking-widest` — it looks cheap

**Line height:**
- `leading-none` (1.0) — pill labels, badge text only
- `leading-snug` (1.375) — card titles, dense UI labels
- `leading-normal` (1.5) — default; most UI
- `leading-relaxed` (1.625) — body prose, descriptions
- Never use `leading-loose` or `leading-[value]` arbitrary

**Truncation:**
- `truncate` — single-line, constrained-width containers
- `line-clamp-2` — two-line titles in cards
- `line-clamp-3` — descriptions in wider cards
- Always pair `line-clamp-*` with a `title` prop on the element for tooltip on overflow

**Text rendering quality:**
- Add `text-balance` to all `<h1>` through `<h3>` and marketing copy
- Add `text-pretty` to multi-sentence descriptions (avoids orphans)

**Numbers:** Use `font-mono` for any number that needs to be compared (counts, IDs, prices). Proportional sans-serif numbers in different rows create visual jitter when scanning.

**Do not:**
- Use `font-bold` (700) in UI chrome — use `font-semibold` (600) as the maximum
- Use font sizes below `text-[10px]` (10px physical)
- Mix more than 2 font families

---

## 5. Spacing & Density

Tailwind's spacing scale is based on 4px increments. This guide uses only the values below. **Do not use arbitrary values like `p-[14px]` or `mt-[7px]`.**

### The Permitted Spacing Scale

| Token | px | Primary Use |
|---|---|---|
| `0.5` | 2px | Tag gap, icon nudge |
| `1` | 4px | Internal pill padding, tight icon gap |
| `1.5` | 6px | Badge gap, inline element gap |
| `2` | 8px | Button internal gap, filter chip gap |
| `2.5` | 10px | Card body padding |
| `3` | 12px | Card grid gap, toolbar section gap |
| `4` | 16px | Standard element gap, form field gap |
| `5` | 20px | Section internal padding |
| `6` | 24px | Page horizontal padding, section vertical gap |
| `8` | 32px | Large section gap |
| `12` | 48px | Page vertical top padding |

### Density Conventions

| Component | Padding | Height |
|---|---|---|
| Page header | `px-6 pt-6 pb-4` | auto |
| Sticky toolbar | `px-6 py-3` | auto (~44px) |
| Toolbar button | `px-2.5 py-1.5` or `size="sm"` | `h-8` (32px) |
| Small icon button | `p-1` | `h-6 w-6` (24px) |
| Input field | `px-3 py-2` | `h-8` (32px) |
| Filter combobox trigger | `px-3 py-1.5` | `h-8` (32px) |
| Table cell | `px-3 py-2` | auto (~40px per row) |
| Card body | `p-2.5` | auto |
| Dropdown item | `px-2 py-1.5` | auto |
| Badge/pill horizontal | `px-1.5 py-0.5` | auto |
| Page section gap | `gap-6` | — |
| Card grid gap | `gap-3` | — |
| Toolbar item gap | `gap-2` | — |

### The Golden Rule of Density
**Never let elements touch.** Every interactive element needs at minimum `gap-1` (4px) from its neighbors. This prevents mis-clicks and visual crowding. When in doubt, add `gap-2`.

---

## 6. Layout Architecture

### App Shell
The outer shell uses the shadcn `Sidebar` component and a fixed header. The sidebar is `--sidebar` colored (slightly darker than background). The main content area starts below the header.

### Page Layout Pattern
Every page follows this exact vertical rhythm:

```tsx
// The canonical page layout
<div className="flex h-full flex-col">

  {/* 1. Page header — title + top-right actions */}
  <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-balance">Page Title</h1>
      <p className="text-xs text-muted-foreground mt-0.5">Subtitle or count</p>
    </div>
    <div className="flex items-center gap-2">
      {/* View toggles, sort, primary actions */}
    </div>
  </div>

  {/* 2. Sticky toolbar — search + filters */}
  <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur
                  supports-[backdrop-filter]:bg-background/60 px-6 py-3 shrink-0">
    <div className="flex items-center gap-2 flex-wrap">
      {/* Search bar, filter comboboxes */}
    </div>
  </div>

  {/* 3. Scrollable content area */}
  <div className="flex-1 overflow-y-auto p-6 min-h-0">
    {/* Grid, table, list */}
  </div>

  {/* 4. Sticky footer — pagination */}
  <div className="flex items-center justify-between border-t px-6 py-3 shrink-0">
    {/* Result count + page controls */}
  </div>

</div>
```

The `min-h-0` on the scroll area is **critical** in a flex column — without it, the area will not constrain properly and the footer will escape the viewport.

### Grid Layouts

**Document cards (portrait-ratio items):**
```tsx
<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
```

**Dashboard/overview cards (wider items):**
```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
```

**Settings/form sections:**
```tsx
<div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
```

### Table Layouts
Use native `<table>` elements inside an overflow wrapper. Never use a CSS grid to simulate a table.

```tsx
<div className="overflow-x-auto rounded-md border">
  <table className="w-full min-w-[640px]">
    <thead>
      <tr className="border-b bg-muted/50">
        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground w-[200px]">
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

Use `hidden md:table-cell` to hide columns at small viewports. Always define `w-*` or `min-w-*` on columns to prevent layout jitter during loading.

### Responsive Breakpoint Strategy

Mobile-first. Enhance for larger screens. Never build desktop-first and shrink.

| Breakpoint | Strategy |
|---|---|
| `base` (0px) | Single column, stacked layout, all content visible |
| `sm` (640px) | 2 columns, some controls on same row |
| `md` (768px) | 3–4 columns, toolbar fully expanded, table columns revealed |
| `lg` (1024px) | 4–5 columns, sidebar fully expanded |
| `xl` (1280px) | Maximum density — 5–6 columns |

---

## 7. Elevation, Depth & Surfaces

Avoid shadows. This design system uses **layering and border contrast** to create depth instead of `drop-shadow` or `box-shadow`.

### Surface Hierarchy

```
Page background     bg-background        base layer
────────────────────────────────────────────────────
Cards               bg-card              layer 1 — separated by border
Toolbars            bg-background/95     layer 1 — separated by border-b
────────────────────────────────────────────────────
Popovers            bg-popover           layer 2 — floating above content
Dropdowns           bg-popover           layer 2
Modals              bg-background        layer 2 (uses Dialog overlay)
────────────────────────────────────────────────────
Tooltips            bg-popover           layer 3 — above everything
```

### Cards
Cards use `bg-card border border-border rounded-lg`. No `shadow-*` class. The border provides enough separation on both light and dark backgrounds.

```tsx
// Standard card
<div className="bg-card border border-border rounded-lg overflow-hidden">
  {/* content */}
</div>

// Interactive card (adds hover state)
<div className="bg-card border border-border rounded-lg overflow-hidden
                hover:border-border/80 transition-colors cursor-pointer">
```

### Sticky Toolbar Frosting
The toolbar uses a backdrop blur to create a sense of "floating over" the content beneath it:
```
bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
```
This creates a glass-like effect in browsers that support it and a solid-but-slightly-transparent fallback in others.

### Modals & Dialogs
- Always rendered via shadcn `Dialog` — never a manually positioned `div`
- The overlay provides depth signal: `bg-black/50` (handled by shadcn)
- `DialogContent` uses `bg-background` — same as the page, creating a clean flat appearance
- Max widths by type: `max-w-sm` (confirmation), `max-w-md` (forms), `max-w-2xl` (content browser), `max-w-3xl` (command palette)

### Borders
- `rounded-sm` (2px) — tiny elements: checkboxes, micro badges
- `rounded` (4px) — pills, tags, inline badges
- `rounded-md` (6px) — inputs, buttons, small cards, dropdowns
- `rounded-lg` (8px) — cards, modals, larger containers
- `rounded-xl` (12px) — featured cards, hero sections only
- Never use `rounded-full` on rectangular elements — only on avatars and circular icon buttons

---

## 8. Component Patterns

### Buttons

Use shadcn `Button` exclusively. Never write `<button className="...">` manually outside of the shadcn component.

| Variant | When to Use |
|---|---|
| `default` | Primary CTA, active pagination page, submit actions |
| `outline` | Secondary toolbar actions, pagination prev/next, cancel/back |
| `ghost` | Icon-only actions, row hover actions, nav items |
| `secondary` | Tertiary actions that need to be visible but not primary |
| `destructive` | Delete, remove, irreversible actions only |
| `link` | Inline text links inside paragraphs only |

**Sizing:**
- `size="default"` (`h-10`) — prominent page-level CTAs only
- `size="sm"` (`h-8 px-3 text-xs`) — toolbars, filters, card actions
- `size="icon"` (`h-9 w-9`) — single icon in normal contexts
- Custom `h-7 w-7` — compact icon buttons in dense toolbars
- Custom `h-6 w-6` — row-level action icons

**Never** change `size` via arbitrary `h-[*]` values — use the ones above.

### Segmented Search Bar
One bordered container. The search input and mode selector share a single border. Interior `border-l` divides them.

```tsx
<div className="flex h-8 items-stretch overflow-hidden rounded-md border bg-background
                focus-within:ring-1 focus-within:ring-ring transition-shadow">
  {/* Search icon + input */}
  <div className="relative flex items-center flex-1">
    <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
    <Input
      className="h-full border-0 rounded-none pl-8 text-xs shadow-none
                 focus-visible:ring-0 bg-transparent"
      placeholder="Search..."
    />
  </div>
  {/* Mode selector */}
  <div className="flex items-stretch border-l">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm"
          className="h-full rounded-none px-2.5 text-xs gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50">
          Title & content
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      {/* ... */}
    </DropdownMenu>
  </div>
</div>
```

**Why one container?** Two separate bordered elements side by side at the same size create a double-border artifact and look amateurish. One container unifies them visually.

### Filter Combobox (Multi-Select + Typeahead)
Built with `Popover` + `Command`. The trigger is a `Button variant="outline"` that changes appearance when selections are active.

**Empty state trigger:**
```tsx
<Button variant="outline" size="sm"
  className="h-8 gap-1.5 text-xs text-muted-foreground">
  <TagIcon className="h-3.5 w-3.5" />
  Tags
  <ChevronDown className="h-3 w-3 opacity-50" />
</Button>
```

**Active state trigger (selections present):**
```tsx
<Button variant="outline" size="sm"
  className="h-8 gap-1 text-xs border-primary/40 bg-primary/5 text-foreground">
  <TagIcon className="h-3.5 w-3.5 text-primary" />
  {/* Max 2 badge pills */}
  {selectedItems.slice(0, 2).map(item => (
    <Badge key={item.id} variant="secondary"
      className="h-4 gap-0.5 px-1 text-[10px] font-normal">
      {item.name}
      <X className="h-2.5 w-2.5 cursor-pointer" onClick={e => { e.stopPropagation(); remove(item) }} />
    </Badge>
  ))}
  {/* Overflow count */}
  {selectedItems.length > 2 && (
    <Badge variant="secondary" className="h-4 px-1 text-[10px]">
      +{selectedItems.length - 2}
    </Badge>
  )}
</Button>
```

**Command item with custom checkbox:**
```tsx
<CommandItem onSelect={() => toggle(item)} className="gap-2">
  <div className={cn(
    "flex h-3.5 w-3.5 items-center justify-center rounded-sm border transition-colors shrink-0",
    isSelected
      ? "border-primary bg-primary text-primary-foreground"
      : "border-muted-foreground/30"
  )}>
    {isSelected && <Check className="h-2.5 w-2.5" />}
  </div>
  <span className="text-sm truncate">{item.name}</span>
  <span className="ml-auto text-xs text-muted-foreground">{item.count}</span>
</CommandItem>
```

### View Toggle (Grid/List)
A single container with a border houses both toggle buttons. Active state uses `bg-muted`.

```tsx
<div className="flex items-center gap-0 rounded-md border p-0.5">
  {[
    { view: "grid", icon: LayoutGrid },
    { view: "list", icon: List },
  ].map(({ view, icon: Icon }) => (
    <Button key={view} variant="ghost" size="icon"
      className={cn(
        "h-7 w-7 rounded-sm",
        currentView === view
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
      onClick={() => setView(view)}
      title={`${view} view`}
    >
      <Icon className="h-3.5 w-3.5" />
    </Button>
  ))}
</div>
```

### Document Card Anatomy
Cards are a fixed-ratio portrait (`aspect-[3/4]`) with three zones: thumbnail with floating tags, content body, and action footer.

```
┌──────────────────────┐
│  [Tag] [Tag]         │  ← absolute top-1.5 left-1.5, flex gap-0.5 flex-wrap
│                      │
│                      │
│     thumbnail        │  ← object-contain, bg-muted (for letterboxing)
│   bg-muted canvas    │
│                      │
│                      │
├──────────────────────┤  ← border-t divides thumbnail from body
│  Correspondent Name  │  ← text-[11px] font-medium text-primary, truncate
│  Document Title      │  ← text-xs font-medium leading-snug line-clamp-2
│  ┌ Doc type name     │  ← text-[10px] text-muted-foreground, truncate
│  ┌ Nov 15, 2023      │  ← text-[10px] text-muted-foreground
│  # 1234 (ASN)        │  ← font-mono text-[10px] text-muted-foreground
├──────────────────────┤  ← border-t divides body from actions
│  ✏  👁  ⬇    [ 2 p] │  ← ghost icon buttons h-6 w-6 + page count right-aligned
└──────────────────────┘
```

**Key details:**
- Thumbnail uses `object-contain` not `object-cover` — documents should not be cropped
- The `bg-muted` canvas behind the thumbnail provides the "paper" look for tall/wide documents
- Correspondent name appears above the title — it provides context for the title
- Action row is always visible (not hover-only) at the bottom
- Page count uses `font-mono` right-aligned in the action row

### List Row Anatomy
Each row in the list view is a `<tr>` with `group` class. Actions are revealed on hover via `opacity-0 group-hover:opacity-100`.

```
│ Title [Tag][Tag]   │ Correspondent  │ Doc type   │ Nov 15, 2023 │ [actions] │
```

- Title column is widest, takes remaining space with `w-full`
- Tags appear inline after the title, wrapped in a `flex gap-1 flex-wrap`
- Hover actions are absolutely positioned or use a fixed-width last column
- Row hover: `hover:bg-muted/40 transition-colors`

### Badges & Pills

```tsx
// Status badge (in tables, cards)
<Badge variant="secondary" className="text-[10px] font-normal px-1.5 py-0.5">
  Active
</Badge>

// Count badge (notification-style)
<Badge className="h-4 min-w-4 px-1 text-[10px] tabular-nums rounded-full">
  16
</Badge>

// Tag pill (with dynamic color — see Section 3)
<span style={tagStyle} className="inline-flex ...">
  Tag Name
</span>
```

### Command/Search Modal
Follow the chat history modal pattern exactly:

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
          No results found.
        </CommandEmpty>
        <CommandGroup heading="Results">
          <CommandItem>...</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
    {/* Optional status footer */}
    <div className="border-t px-4 py-2.5">
      <p className="text-[10px] text-muted-foreground">
        Status line or keyboard hints
      </p>
    </div>
  </DialogContent>
</Dialog>
```

### Pagination
Compact: result count + prev/next in toolbar. Full: numbered page window + prev/next in footer.

```tsx
// Sliding window of 5 page numbers centered on current page
const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
  if (totalPages <= 5) return i + 1
  if (currentPage <= 3) return i + 1
  if (currentPage >= totalPages - 2) return totalPages - 4 + i
  return currentPage - 2 + i
})

// Render
{pageNumbers.map(n => (
  <Button
    key={n}
    variant={n === currentPage ? "default" : "outline"}
    size="icon"
    className="h-7 w-7 text-xs"
    onClick={() => setPage(n)}
    disabled={isFetching}
  >
    {n}
  </Button>
))}
```

Active page: `variant="default"`. All buttons: `h-7 w-7`. Nav buttons: `h-7 px-2 gap-1 text-xs` with word label + icon.

### Tabs

```tsx
<Tabs defaultValue="overview">
  <TabsList className="h-9 rounded-md p-1">
    <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
    <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview" className="mt-4">
    {/* content */}
  </TabsContent>
</Tabs>
```

For page-level tabs (navigating between sub-pages), use `border-b` style tabs, not the pill/rounded style. Pill tabs are for in-page content switching only.

---

## 9. Interaction & Motion

### The Motion Rule
**Motion must be functional, not decorative.** Every animation either:
1. Communicates a state change (loading → loaded, collapsed → expanded)
2. Provides spatial context (item enters from direction it came from)
3. Reduces perceived latency (skeleton screens, transition placeholders)

Animations that exist purely to look "alive" are banned.

### Duration Standards

| Interaction | Duration | Easing |
|---|---|---|
| Hover color change | `duration-150` | `ease-in-out` |
| Popover/dropdown open | `duration-200` | `ease-out` |
| Modal open/close | `duration-300` | `ease-in-out` |
| Card hover scale | `duration-200` | `ease-out` |
| Toast enter/exit | `duration-300` | `ease-in-out` |
| Loading state fade | `duration-200` | `ease-in-out` |
| Page transition | none (instant) | — |

Never use `duration-500` or longer for UI interactions. Long animations feel broken.

### Specific Interaction Patterns

**Card thumbnail hover:**
```tsx
// Parent card
<div className="group overflow-hidden ...">
  {/* Thumbnail wrapper */}
  <div className="relative overflow-hidden">
    <img className="transition-transform duration-200 group-hover:scale-[1.02]" ... />
    {/* Scrim overlay */}
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-200" />
  </div>
</div>
```

**List row hover actions:**
```tsx
<tr className="group hover:bg-muted/40 transition-colors">
  <td>...</td>
  <td>
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
      <Button variant="ghost" size="icon" className="h-6 w-6">...</Button>
    </div>
  </td>
</tr>
```

**Loading dimming (data refresh without skeleton):**
```tsx
// Dim existing content during background refetch
<div className={cn("transition-opacity duration-200", isFetching && "opacity-60 pointer-events-none")}>
  {/* Content */}
</div>
```

**Focus ring:**
shadcn components handle focus rings automatically via `ring-ring`. Never suppress focus rings. Never add custom `outline-none` without replacing with `focus-visible:ring-*`.

---

## 10. Loading, Empty & Error States

### Loading Skeletons

**Rule:** Skeletons must mirror the exact shape of the content they replace. This prevents layout shift and creates a sense of reliability.

```tsx
// Document card grid skeleton
<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
  {Array.from({ length: 24 }).map((_, i) => (
    <div key={i} className="space-y-1.5">
      <Skeleton className="aspect-[3/4] w-full rounded-lg" />
      <Skeleton className="h-3 w-2/3" />   {/* title line 1 */}
      <Skeleton className="h-3 w-1/2" />   {/* title line 2 */}
      <Skeleton className="h-2.5 w-1/3" /> {/* metadata */}
    </div>
  ))}
</div>

// Table row skeleton
<tbody>
  {Array.from({ length: 15 }).map((_, i) => (
    <tr key={i} className="border-b">
      <td className="px-3 py-2"><Skeleton className="h-4 w-48" /></td>
      <td className="px-3 py-2"><Skeleton className="h-4 w-24" /></td>
      <td className="px-3 py-2"><Skeleton className="h-4 w-20" /></td>
    </tr>
  ))}
</tbody>
```

**Shimmer:** shadcn's `Skeleton` component includes an animated shimmer. Do not add a custom shimmer — use `Skeleton` as-is.

**Loading count:** Always render the same number of skeletons as `pageSize` — this prevents the page from shrinking/growing when data loads.

### Empty States

Three types of empty states exist. Each has a slightly different treatment:

**1. No data (collection is genuinely empty):**
```tsx
<div className="flex h-[50vh] flex-col items-center justify-center gap-3 text-center">
  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
    <FileX className="h-7 w-7 text-muted-foreground" />
  </div>
  <div>
    <p className="text-sm font-medium text-foreground">No documents yet</p>
    <p className="text-xs text-muted-foreground mt-1 max-w-xs">
      Documents will appear here once they are added to Paperless.
    </p>
  </div>
  {/* Optional primary action */}
  <Button size="sm" variant="outline" className="mt-1">
    Learn how to import
  </Button>
</div>
```

**2. No search results (filters returned nothing):**
```tsx
<div className="flex h-[40vh] flex-col items-center justify-center gap-2 text-center">
  <Search className="h-10 w-10 text-muted-foreground/30" />
  <p className="text-sm font-medium">No results found</p>
  <p className="text-xs text-muted-foreground">
    Try adjusting your search or removing some filters
  </p>
  <Button size="sm" variant="ghost" onClick={clearFilters} className="text-xs mt-1">
    Clear all filters
  </Button>
</div>
```

**3. Error state:**
```tsx
<div className="flex h-[40vh] flex-col items-center justify-center gap-2">
  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
    <AlertCircle className="h-6 w-6 text-destructive" />
  </div>
  <p className="text-sm font-medium">Failed to load</p>
  <p className="text-xs text-muted-foreground">Something went wrong. Please try again.</p>
  <Button size="sm" variant="outline" onClick={retry} className="mt-1">
    Retry
  </Button>
</div>
```

---

## 11. Icons

### Library Assignment
- **`lucide-react`** — every icon in UI chrome: actions, toolbar, navigation, metadata, status
- **`@phosphor-icons/react`** — only in `app/components/layout/sidebar/app-sidebar.tsx`. Do not add Phosphor icons anywhere else.

### Size Scale

| Context | Size | Class |
|---|---|---|
| Inline with 10px text | 10px | `h-2.5 w-2.5` |
| Inline with 12px text | 12px | `h-3 w-3` |
| Toolbar / filter | 14px | `h-3.5 w-3.5` |
| Standard UI | 16px | `h-4 w-4` |
| Navigation items | 18px | `h-[18px] w-[18px]` |
| Section heading | 20px | `h-5 w-5` |
| Empty state display | 28px–48px | `h-7 w-7` to `h-12 w-12` |

### Color Rules
- Toolbar icons: `text-muted-foreground` — hover: `hover:text-foreground`
- Action icons inside `Button ghost`: inherit from button text color
- Decorative / empty-state icons: `text-muted-foreground opacity-30` or `opacity-50`
- Status icons (error, success): `text-destructive` / `text-green-500` — the one place non-token colors are allowed for universal meaning
- Never use colored icons for decoration

### Icon-Only Buttons
Every icon-only `Button` **must** have a `title` prop for tooltip-on-hover. This is both an a11y and usability requirement.

```tsx
<Button variant="ghost" size="icon" className="h-6 w-6" title="Edit document">
  <Pencil className="h-3 w-3" />
  <span className="sr-only">Edit document</span>
</Button>
```

---

## 12. Forms & Inputs

### Input Anatomy
```tsx
<div className="space-y-2">
  <Label htmlFor="title" className="text-sm font-medium">
    Title
  </Label>
  <Input
    id="title"
    placeholder="Enter document title..."
    className="h-9 text-sm"
  />
  <p className="text-xs text-muted-foreground">
    Helper text explaining the field.
  </p>
</div>
```

Always pair `<Label>` with `htmlFor` matching the input's `id`. Never use a `<div>` as a label.

### Form Layout
```tsx
// Single column form
<form className="space-y-4">
  {/* fields */}
</form>

// Two-column form (on md+)
<form className="grid grid-cols-1 gap-4 md:grid-cols-2">
  {/* fields */}
  {/* Full-width field in a 2-col grid: */}
  <div className="md:col-span-2">...</div>
</form>
```

### Input Sizing
- `h-9` (`text-sm`) — standard form inputs inside cards and panels
- `h-8` (`text-xs`) — compact toolbar search inputs
- `h-11` (`text-base`) — prominent page-level search bars

### Select, Combobox, DatePicker
Use shadcn `Select`, `Popover+Command`, `Calendar+Popover` respectively. Never a native `<select>`. The trigger should always be `h-9` for form use, `h-8` for toolbar use.

### Validation States
```tsx
// Error state
<Input className={cn(isError && "border-destructive focus-visible:ring-destructive")} />
{isError && <p className="text-xs text-destructive mt-1">{errorMessage}</p>}
```

### Textarea
```tsx
<Textarea
  className="min-h-[80px] resize-y text-sm"
  placeholder="..."
/>
```
Always set `min-h-[*]` in px to prevent zero-height initial state. Use `resize-y` only — never `resize` (allows horizontal resize which breaks layouts) or `resize-none`.

---

## 13. Data Display

### Numbers & Counts

**Document counts, result counts:**
```tsx
<span className="text-xs text-muted-foreground">
  {count.toLocaleString()} documents
</span>
```

Always use `.toLocaleString()` for large numbers — never show `61` vs `1000` with raw `toString()`. `10,000` is clearer than `10000`.

**Numeric identifiers (ASN, IDs):**
```tsx
<span className="font-mono text-[10px] text-muted-foreground">
  #{asn}
</span>
```

`font-mono` ensures columnar alignment when scanning IDs in a list.

### Dates

**Always format with `Intl.DateTimeFormat` or `toLocaleDateString`:**
```tsx
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
// → "Nov 15, 2023"
```

Never display raw ISO strings (`2023-11-15T00:00:00Z`) in the UI.

**Relative dates** (for recent items):
```tsx
// Use a simple relative helper for items < 7 days old
const isRecent = (date: string) => Date.now() - new Date(date).getTime() < 7 * 24 * 60 * 60 * 1000
// Show "3 days ago" if recent, "Nov 15, 2023" otherwise
```

### Tables — Column Hierarchy
Order table columns by importance to the user (left to right), not by database schema order:

1. **Title/Name** — always first, widest column, takes remaining space
2. **Primary relationship** (correspondent, author) — second
3. **Classification** (document type, category) — third
4. **Date** — second to last (right-aligned or near-right)
5. **Actions** — always last, fixed width, right-aligned

```tsx
<th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
  Title
</th>
<th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground w-[160px] hidden md:table-cell">
  Correspondent
</th>
<th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground w-[120px] hidden sm:table-cell">
  Created
</th>
<th className="px-3 py-2 w-[80px]">
  {/* Actions column — no label */}
</th>
```

### Scroll & Overflow

Long content in tables and cards must never break layout:
- Table cells: `max-w-0 truncate` — the `max-w-0` forces truncation inside a flex/table cell
- Card titles: `line-clamp-2`
- Filter tags overflow: `flex-wrap` with max visible + count badge

---

## 14. Data Fetching Pattern

### RSC → Client Query Handoff

Always pre-fetch the first page of data in the RSC (`page.tsx`) to eliminate loading flash on the initial paint. Hand this data to the client component as `initialData`.

```tsx
// app/documents/page.tsx (RSC)
import { getDocuments } from "@/lib/documents/api"
import DocumentsView from "./documents-view"

export default async function DocumentsPage() {
  const initialData = await getDocuments(undefined, 1, 24)
  return <DocumentsView initialData={initialData} />
}
```

```tsx
// app/documents/documents-view.tsx ("use client")
const { data, isLoading, isFetching } = useQuery({
  queryKey: ["documents", debouncedFilters, page],
  queryFn: () => fetchDocuments(debouncedFilters, page, PAGE_SIZE),
  initialData: page === 1 && !hasActiveFilters ? initialData : undefined,
  placeholderData: (prev) => prev,  // prevents flash between pages
})
```

### Query Keys
Structure query keys as `[resource, ...filters, page]`. All filter parameters must be in the key — missing one means stale data will appear when that filter changes.

```tsx
queryKey: ["documents", filters.query, filters.tags, filters.documentType, page]
// Or as object (easier to debug in DevTools):
queryKey: ["documents", { ...filters, page }]
```

### Debouncing Search Input
Always debounce text search before including in the query key. 300ms is the standard.

```tsx
const [searchQuery, setSearchQuery] = useState("")
const debouncedSearch = useDebounce(searchQuery, 300)

// Use debouncedSearch in the query key, not searchQuery
queryKey: ["documents", debouncedSearch, ...]
```

### Reference Data (Tags, Document Types)
Cache aggressively — these change rarely. Use `staleTime: 5 * 60 * 1000` (5 minutes).

```tsx
const { data: tags = [] } = useQuery({
  queryKey: ["tags"],
  queryFn: () => fetch("/api/documents/tags").then(r => r.json()),
  staleTime: 5 * 60 * 1000,
})
```

### API Route Proxy Pattern

All external Paperless API calls go through `paperlessFetch` from `@/lib/paperless-tools`. Never call external URLs directly from components or API routes.

```ts
// app/api/documents/tags/route.ts
import { paperlessFetch } from "@/lib/paperless-tools"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const data = await paperlessFetch("/api/tags/?page_size=500")
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
  }
}
```

---

## 15. Accessibility

Accessibility is not a checklist — it is a quality signal. If something is hard to use with a keyboard or screen reader, it is probably also confusing for sighted mouse users.

### Semantic HTML
- `<h1>` once per page, `<h2>`–`<h3>` for sub-sections. Never skip heading levels.
- `<main>` wraps the page content area. `<nav>` wraps navigation. `<header>` / `<footer>` at the page level.
- `<table>` for tabular data — never a CSS grid or div layout.
- `<button>` for actions. `<a>` for navigation. Never swap them.

### Labels & ARIA
```tsx
// Always associate label with input
<Label htmlFor="search-input">Search</Label>
<Input id="search-input" />

// Icon-only buttons
<Button title="Download document">
  <Download className="h-4 w-4" />
  <span className="sr-only">Download document</span>
</Button>

// Images
<img src={thumbnailUrl} alt={`Thumbnail for ${document.title}`} />
// Decorative images
<img src={decorativeImage} alt="" role="presentation" />

// Dynamic regions
<div aria-live="polite" aria-atomic="true">
  {isFetching ? "Loading..." : `${count} documents`}
</div>
```

### Keyboard Navigation
- All interactive elements must be focusable via `Tab` in logical order
- Modal dialogs trap focus (shadcn `Dialog` does this automatically)
- `Escape` closes modals and dropdowns (shadcn handles this)
- `Enter` and `Space` activate buttons and checkboxes (shadcn handles this)

### Color Contrast
- Never rely on color alone to communicate state (add an icon or label)
- All text on `bg-background` must meet WCAG AA: 4.5:1 for normal text, 3:1 for large text
- The token system is designed to meet these ratios — do not override token colors with lower-contrast arbitrary values

### Focus Rings
- Never use `outline-none` or `focus:outline-none` without replacing with `focus-visible:ring-*`
- The `ring-ring` token is configured for all shadcn interactive components
- Exception: `focus-visible:ring-0` is acceptable inside a compound component that has its own outer ring (e.g., the inner `Input` in the segmented search bar)

---

## 16. Dark Mode

### How It Works
`next-themes` adds a `.dark` class to `<html>`. All CSS variables in `app/globals.css` are overridden under `.dark`. Tailwind reads these variables, so `bg-background` automatically uses the dark value when `.dark` is active.

### Rules
1. **Never write `dark:` Tailwind variants manually** for color tokens. If you need `dark:text-white`, it means you used a non-token class (`text-black`) somewhere upstream. Fix the root cause.
2. The only acceptable `dark:` usage is for non-color concerns: `dark:border-opacity-*`, non-token structural differences.
3. When using `style={{}}` for dynamic colors (tags), ensure sufficient contrast against both `bg-background` (light: white) and `bg-background` (dark: near-black). Solid tag colors usually satisfy this. Tinted variations with low-opacity may need darkening.

### Testing Dark Mode
Before considering a component complete, verify:
- All text is readable
- All borders are visible
- No hard-coded white or black backgrounds remain
- Hover states are visible (the `bg-accent` hover works differently in dark)

### The Sidebar Special Case
The sidebar uses `--sidebar` which is slightly different from `--background`. In dark mode, `--sidebar` is darker (`oklch(19% 0 0)`) than `--background` (`oklch(21.34% 0 0)`). Use `bg-sidebar` on the sidebar element, not `bg-background`, to maintain this distinction.

---

## 17. File & Code Conventions

### Directory Structure
```
app/
├── [feature]/
│   ├── page.tsx              ← RSC only; fetch initial data; minimal JSX
│   ├── [feature]-view.tsx    ← "use client"; all state; orchestrating component
│   ├── [sub-component].tsx   ← "use client" or server; receives typed props
│   └── ...
├── api/
│   └── [resource]/
│       └── route.ts          ← thin proxy; try/catch; NextResponse.json only
├── components/
│   └── layout/
│       ├── layout-app.tsx    ← app shell; sidebar + header
│       ├── header.tsx        ← top bar
│       └── sidebar/
│           └── app-sidebar.tsx
└── globals.css
components/
└── ui/                       ← shadcn only; NEVER edit these files
lib/
└── [domain]/
    └── api.ts                ← typed wrappers; use cache(); paperlessFetch only
```

### Component Authoring Rules

**File naming:** `kebab-case.tsx` always. Match the export name in PascalCase.

**One default export per file.** Named exports are for types and utilities only.

**Props interface directly above the component:**
```tsx
interface DocumentCardProps {
  document: PaperlessDocument
  onEdit?: (id: number) => void
}

export default function DocumentCard({ document, onEdit }: DocumentCardProps) {
```

**No inline complex logic in JSX.** Extract to a const above the return:
```tsx
// Wrong
<div>{documents.filter(d => d.tags.length > 0).sort(...).map(d => <Card key={d.id} />)}</div>

// Correct
const filteredDocs = documents.filter(d => d.tags.length > 0).sort(...)
return <div>{filteredDocs.map(d => <Card key={d.id} />)}</div>
```

**Extract repeated JSX into components.** If a pattern appears more than twice, make it a component.

**Import order:**
```tsx
// 1. React
import { useState, useCallback } from "react"
// 2. Next.js
import Image from "next/image"
import Link from "next/link"
// 3. External libraries
import { useQuery } from "@tanstack/react-query"
// 4. Internal UI components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// 5. Internal utilities and types
import { cn } from "@/lib/utils"
import type { PaperlessDocument } from "@/lib/documents/api"
// 6. Local components (same directory)
import DocumentCard from "./document-card"
```

**Type imports:** Always use `import type` for type-only imports. It prevents accidental runtime imports of type definitions.

### API Lib Conventions
```ts
// lib/documents/api.ts

import { cache } from "react"
import { paperlessFetch } from "@/lib/paperless-tools"

// Types always precede the functions that use them
export type PaperlessDocument = { ... }

// All fetch functions use cache() for RSC deduplication
export const getDocuments = cache(async (filters?: DocumentFilters, page = 1, pageSize = 24) => {
  // Build URLSearchParams — never string-interpolate query params
  const params = new URLSearchParams()
  if (filters?.query) params.set("query", filters.query)
  if (filters?.tags?.length) filters.tags.forEach(id => params.append("tags__id__all", String(id)))
  return paperlessFetch(`/api/documents/?${params.toString()}`)
})
```

---

## 18. The Anti-Pattern Reference

This is the most important section. The patterns below produce bad UI. Do not write these.

### Color Anti-Patterns
```tsx
// WRONG — hard-coded colors bypass theming and break dark mode
<div className="bg-white text-black border-gray-200">
<p className="text-gray-500">
<button className="bg-zinc-800 text-white">

// WRONG — Tailwind color scale classes instead of tokens
<div className="bg-slate-50 text-slate-900">

// CORRECT
<div className="bg-background text-foreground border-border">
<p className="text-muted-foreground">
<Button variant="default">
```

### Spacing Anti-Patterns
```tsx
// WRONG — arbitrary values
<div className="p-[14px] mt-[7px] gap-[11px]">
<div style={{ padding: "14px", marginTop: "7px" }}>

// WRONG — space-* utility (creates margin, not gap — breaks with wrapping)
<div className="flex space-x-4">

// CORRECT — use the permitted spacing scale with gap
<div className="p-3.5 mt-2 gap-3">
<div className="flex gap-4">
```

### Layout Anti-Patterns
```tsx
// WRONG — absolute positioning for layout structure
<div className="relative">
  <div className="absolute top-0 left-0 right-0">toolbar</div>
  <div className="mt-12">content</div>
</div>

// WRONG — fixed pixel heights on flex containers
<div className="flex flex-col h-[600px]">

// WRONG — overflow hidden on flex parent without min-h-0 on scroll child
<div className="flex flex-col h-full">
  <div className="overflow-y-auto"> {/* WILL NOT SCROLL */}

// CORRECT — flex column with min-h-0 on scroll area
<div className="flex flex-col h-full">
  <div className="shrink-0">toolbar</div>
  <div className="flex-1 overflow-y-auto min-h-0">content</div>
</div>
```

### Typography Anti-Patterns
```tsx
// WRONG — font-bold in UI chrome
<h2 className="font-bold">Section</h2>

// WRONG — custom font size that bypasses scale
<p className="text-[13px]">

// WRONG — uppercase without tracking
<span className="uppercase text-xs">Label</span>

// WRONG — very long lines without max-width
<p className="text-sm">{veryLongDescriptionWith200Characters}</p>

// CORRECT
<h2 className="font-semibold">Section</h2>
<p className="text-xs">  or  text-sm  — pick from the scale
<span className="text-xs uppercase tracking-wide">Label</span>
<p className="text-sm max-w-prose">{longDescription}</p>
```

### Animation Anti-Patterns
```tsx
// WRONG — decorative animations with no functional purpose
<div className="animate-pulse hover:animate-bounce">
<div className="transition-all duration-500 hover:rotate-3 hover:scale-110">

// WRONG — transition-all (catches every property — expensive and unpredictable)
<div className="transition-all duration-200">

// CORRECT — specific transition properties
<div className="transition-colors duration-150">
<div className="transition-transform duration-200">
<div className="transition-opacity duration-150">
```

### Shadow Anti-Patterns
```tsx
// WRONG — shadows as depth signal
<div className="shadow-md rounded-lg">
<div className="shadow-xl hover:shadow-2xl">

// CORRECT — borders for separation, no shadow
<div className="border border-border rounded-lg">
```

### Gradient Anti-Patterns
```tsx
// WRONG — decorative gradients
<div className="bg-gradient-to-r from-blue-500 to-purple-600">
<div className="bg-gradient-to-b from-background to-muted">

// CORRECT — solid colors only
<div className="bg-primary">
<div className="bg-muted">
```

### Icon Anti-Patterns
```tsx
// WRONG — emoji as icon
<button>📄 Download</button>

// WRONG — wrong size for context
<Button size="icon"><Download className="h-6 w-6" /></Button>  // too large for h-9 button

// WRONG — missing title on icon-only button
<Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>

// CORRECT
<Button variant="ghost" size="icon" title="Edit document">
  <Pencil className="h-4 w-4" />
  <span className="sr-only">Edit document</span>
</Button>
```

### Data Fetching Anti-Patterns
```tsx
// WRONG — fetching in useEffect
useEffect(() => {
  fetch("/api/documents").then(r => r.json()).then(setDocuments)
}, [])

// WRONG — no debounce on search
queryKey: ["documents", searchQuery]  // fires on every keystroke

// WRONG — localStorage for persistent data
localStorage.setItem("documents", JSON.stringify(data))

// CORRECT — TanStack Query with debounced key
const debouncedQuery = useDebounce(searchQuery, 300)
const { data } = useQuery({ queryKey: ["documents", debouncedQuery], queryFn: ... })
```

### Accessibility Anti-Patterns
```tsx
// WRONG — div as button
<div onClick={handleClick} className="cursor-pointer">Action</div>

// WRONG — suppressed focus ring
<button className="outline-none focus:outline-none">

// WRONG — missing alt text
<img src={thumbnail} />

// WRONG — color as only state indicator
<div className={isActive ? "text-green-500" : "text-red-500"}>Status</div>

// CORRECT
<Button onClick={handleClick}>Action</Button>
<img src={thumbnail} alt={`Preview of ${document.title}`} />
<div className={cn(isActive ? "text-green-500" : "text-red-500")}>
  {isActive ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
  {isActive ? "Active" : "Inactive"}
</div>
```

---

## Quick Reference Card

When building any new feature, run through this checklist:

```
[ ] All colors use semantic tokens (bg-background, text-muted-foreground, etc.)
[ ] No arbitrary spacing values ([14px], [7px])
[ ] flex gap-* used for spacing, not space-x-* or margins
[ ] flex flex-col h-full with min-h-0 on scroll areas
[ ] Skeleton count matches pageSize
[ ] Empty state exists for 0-result scenarios
[ ] Error state exists for failed fetches
[ ] All icon-only buttons have title + sr-only text
[ ] All images have meaningful alt text
[ ] Search input is debounced (300ms)
[ ] No useEffect for data fetching
[ ] Table uses semantic <table> HTML
[ ] Dark mode verified (no hard-coded white/black)
[ ] No shadows used for depth (use borders)
[ ] No gradients used for decoration
[ ] transition-colors / transition-opacity (never transition-all)
[ ] font-semibold maximum weight in UI chrome
[ ] text-[10px] minimum font size
[ ] Dynamic hex colors use inline style={{}}, not arbitrary Tailwind
```
