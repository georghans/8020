export const isSupabaseEnabled = Boolean(
  (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) ||
    process.env.NEXT_PUBLIC_SUPABASE_URL
)
