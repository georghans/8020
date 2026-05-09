import {
  BookOpenText,
  Brain,
  Code,
  LightbulbIcon,
  NotepadIcon,
  PaintBrushIcon,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr"

export const NON_AUTH_DAILY_MESSAGE_LIMIT = 5
export const AUTH_DAILY_MESSAGE_LIMIT = 1000
export const REMAINING_QUERY_ALERT_THRESHOLD = 2
export const DAILY_FILE_UPLOAD_LIMIT = 5
export const DAILY_LIMIT_PRO_MODELS = 500

export const NON_AUTH_ALLOWED_MODELS: string[] = []

export const FREE_MODELS_IDS: string[] = []

export const MODEL_DEFAULT = process.env.NEXT_PUBLIC_DEFAULT_MODEL || ""

export const APP_NAME = "8020"

export const SUGGESTIONS = [
  {
    label: "Rechnungen analysieren",
    highlight: "Rechnungen analysieren",
    prompt: `Rechnungnen analysieren`,
    items: [
      "Rechnungen des letzen Monats zusammenfassen",
      "Rechnungen durchgehen und Übersicht über Ausgaben und Einnahmen geben",
    ],
    icon: NotepadIcon,
  },
  {
    label: "Code",
    highlight: "Help me",
    prompt: `Help me`,
    items: [
      "Help me write a function to reverse a string in JavaScript",
      "Help me create a responsive navbar in HTML/CSS",
      "Help me write a SQL query to find duplicate emails",
      "Help me convert this Python function to JavaScript",
    ],
    icon: Code,
  },
  {
    label: "Design",
    highlight: "Design",
    prompt: `Design`,
    items: [
      "Design a color palette for a tech blog",
      "Design a UX checklist for mobile apps",
      "Design 5 great font pairings for a landing page",
      "Design better CTAs with useful tips",
    ],
    icon: PaintBrushIcon,
  },
  {
    label: "Research",
    highlight: "Research",
    prompt: `Research`,
    items: [
      "Research the pros and cons of remote work",
      "Research the differences between Apple Vision Pro and Meta Quest",
      "Research best practices for password security",
      "Research the latest trends in renewable energy",
    ],
    icon: BookOpenText,
  },
  {
    label: "Get inspired",
    highlight: "Inspire me",
    prompt: `Inspire me`,
    items: [
      "Inspire me with a beautiful quote about creativity",
      "Inspire me with a writing prompt about solitude",
      "Inspire me with a poetic way to start a newsletter",
      "Inspire me by describing a peaceful morning in nature",
    ],
    icon: Sparkle,
  },
  {
    label: "Think deeply",
    highlight: "Reflect on",
    prompt: `Reflect on`,
    items: [
      "Reflect on why we fear uncertainty",
      "Reflect on what makes a conversation meaningful",
      "Reflect on the concept of time in a simple way",
      "Reflect on what it means to live intentionally",
    ],
    icon: Brain,
  },
  {
    label: "Learn gently",
    highlight: "Explain",
    prompt: `Explain`,
    items: [
      "Explain quantum physics like I'm 10",
      "Explain stoicism in simple terms",
      "Explain how a neural network works",
      "Explain the difference between AI and AGI",
    ],
    icon: LightbulbIcon,
  },
]

export const SYSTEM_PROMPT_DEFAULT = `You are 8020, a thoughtful and clear assistant. Your tone is calm, minimal, and human. You write with intention: never too much, never too little. You avoid cliches, speak simply, and offer helpful, grounded answers. When needed, you ask good questions. You aim to clarify and help the user move forward.`

export const MESSAGE_MAX_LENGTH = 10000
