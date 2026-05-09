import { requireUser } from "@/lib/supabase/server"
import {
  convertFromApiFormat,
  defaultPreferences,
} from "@/lib/user-preference-store/utils"
import type { UserProfile } from "./types"

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const { supabase, user } = await requireUser()

    const { data: userProfileData } = await supabase
      .from("users")
      .select("*, user_preferences(*)")
      .eq("id", user.userId)
      .single()

    const formattedPreferences = userProfileData?.user_preferences
      ? convertFromApiFormat(userProfileData.user_preferences)
      : defaultPreferences

    return {
      ...userProfileData,
      id: user.userId,
      email: user.email,
      profile_image: user.profileImage,
      display_name: user.displayName,
      anonymous: false,
      preferences: formattedPreferences,
    } as UserProfile
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return null
    }

    console.error("Failed to load user profile:", error)
    return null
  }
}
