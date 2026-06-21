import { cache } from "react";
import { ensureDailyCheckIn, type DailyCheckInStatus } from "@/lib/checkin";
import { createClient } from "@/lib/supabase/server";
import { isStaleAuthSessionError } from "@/lib/supabase/session";
import type { Profile, UserStats } from "@/types/database";

export const getSessionUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    if (isStaleAuthSessionError(error)) {
      await supabase.auth.signOut();
    }
    return null;
  }

  return user;
});

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return data;
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

export type AuthContext = {
  user: Awaited<ReturnType<typeof getSessionUser>>;
  profile: Profile | null;
  stats: UserStats | null;
  checkIn: DailyCheckInStatus | null;
};

export const getAuthContext = cache(async (): Promise<AuthContext> => {
  const user = await getSessionUser();
  if (!user) {
    return { user: null, profile: null, stats: null, checkIn: null };
  }

  const [profile, checkInResult] = await Promise.all([
    getProfile(user.id),
    ensureDailyCheckIn(user.id),
  ]);

  return {
    user,
    profile,
    stats: checkInResult.stats,
    checkIn: checkInResult.status,
  };
});

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
