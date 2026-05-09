import type { UserProfile } from "@/lib/user/types"
import { signOut } from "next-auth/react"

export async function fetchUserProfile(_id?: string): Promise<UserProfile | null> {
  const response = await fetch("/api/user", { cache: "no-store" })
  if (!response.ok) return null

  const data = await response.json()
  return {
    ...data,
    profile_image: data.profile_image || "",
    display_name: data.display_name || "",
  }
}

export async function updateUserProfile(
  _id: string,
  updates: Partial<UserProfile>
): Promise<boolean> {
  const response = await fetch("/api/user", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  })

  return response.ok
}

export async function signOutUser(): Promise<boolean> {
  await signOut({ callbackUrl: "/" })
  return true
}

export function subscribeToUserUpdates(
  _userId: string,
  _onUpdate: (newData: Partial<UserProfile>) => void
) {
  return () => {}
}
