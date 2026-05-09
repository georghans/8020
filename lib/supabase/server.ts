import type { Database } from "@/app/types/database.types"
import { authOptions } from "@/auth"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"

export function createClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export type AuthenticatedUser = {
  userId: string
  email: string
  displayName: string
  profileImage: string
}

export async function requireUser(): Promise<{
  supabase: NonNullable<ReturnType<typeof createClient>>
  user: AuthenticatedUser
}> {
  const session = await getServerSession(authOptions)
  const sessionUser = session?.user

  if (!sessionUser?.id) {
    throw new Error("UNAUTHORIZED")
  }

  const supabase = createClient()
  if (!supabase) {
    throw new Error("SUPABASE_NOT_CONFIGURED")
  }

  const user: AuthenticatedUser = {
    userId: sessionUser.id,
    email: sessionUser.email ?? `${sessionUser.id}@keycloak.local`,
    displayName: sessionUser.name ?? sessionUser.email ?? "User",
    profileImage: sessionUser.image ?? "",
  }

  const { error } = await supabase.from("users").upsert(
    {
      id: user.userId,
      email: user.email,
      display_name: user.displayName,
      profile_image: user.profileImage,
      anonymous: false,
      last_active_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  )

  if (error) {
    throw new Error(`USER_UPSERT_FAILED: ${error.message}`)
  }

  return { supabase, user }
}

export function authErrorResponse(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (error.message === "SUPABASE_NOT_CONFIGURED") {
      return Response.json(
        { error: "Supabase is not configured" },
        { status: 500 }
      )
    }
  }

  return null
}
