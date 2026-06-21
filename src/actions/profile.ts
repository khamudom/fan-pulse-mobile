"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { emitActivityEvent } from "@/lib/activityEvents";
import { validateUsername } from "@/lib/social";

export type ProfileActionState = {
  error?: string;
  success?: string;
};

export async function beginJourneyWithNation(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const country = String(formData.get("country") ?? "").trim();
  if (!country) {
    return { error: "Choose a nation first." };
  }

  const user = await getSessionUser();
  if (!user) {
    redirect(`/login?country=${encodeURIComponent(country)}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name: user.email?.split("@")[0] || "Fan",
    favorite_country: country,
    updated_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };

  await emitActivityEvent(user.id, "nation", { country });

  revalidatePath("/", "layout");
  redirect(`/my-world-cup?country=${encodeURIComponent(country)}`);
}

export async function saveMyWorldCup(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const favoriteCountry = String(formData.get("favoriteCountry") ?? "").trim();
  const secondaryCountry = String(formData.get("secondaryCountry") ?? "").trim();
  const displayName = String(formData.get("displayName") ?? "").trim();
  const usernameRaw = String(formData.get("username") ?? "").trim();
  const playerIds = formData.getAll("favoritePlayers").map(String);

  if (!favoriteCountry) {
    return { error: "Please select your favorite country." };
  }

  const supabase = await createClient();

  const upsertData: {
    id: string;
    display_name: string;
    favorite_country: string;
    secondary_country: string | null;
    favorite_player_ids: string[];
    onboarding_complete: boolean;
    updated_at: string;
    username?: string;
  } = {
    id: user.id,
    display_name: displayName || user.email?.split("@")[0] || "Fan",
    favorite_country: favoriteCountry,
    secondary_country: secondaryCountry || null,
    favorite_player_ids: playerIds,
    onboarding_complete: true,
    updated_at: new Date().toISOString(),
  };

  if (usernameRaw) {
    const usernameError = validateUsername(usernameRaw);
    if (usernameError) return { error: usernameError };
    upsertData.username = usernameRaw.toLowerCase();
  }

  const { error } = await supabase
    .from("profiles")
    .upsert(upsertData)
    .eq("id", user.id);

  if (error) return { error: error.message };

  await emitActivityEvent(user.id, "nation", { country: favoriteCountry });

  revalidatePath("/", "layout");
  revalidatePath("/my-world-cup");
  redirect("/my-world-cup");
}

export async function updateDisplayName(displayName: string) {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const trimmed = displayName.trim();
  if (!trimmed) return { error: "Display name can't be empty." };
  if (trimmed.length > 50) {
    return { error: "Display name must be 50 characters or fewer." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ display_name: trimmed, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/profile");
  return { success: true };
}
