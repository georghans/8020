import { requireUser } from "@/lib/supabase/server"

export async function validateUserIdentity(
  userId: string,
  _isAuthenticated?: boolean
) {
  const { supabase, user } = await requireUser()

  if (user.userId !== userId) {
    throw new Error("User ID does not match authenticated user")
  }

  return supabase
}
