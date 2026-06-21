"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth";
import { completeChallengeBySlug, ensureDailyCheckIn } from "@/lib/checkin";

export type { DailyCheckInStatus } from "@/lib/checkin";

function revalidateCheckInPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/profile");
  revalidatePath("/challenges");
}

export async function performDailyCheckIn() {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const result = await ensureDailyCheckIn(user.id, { awaitWrites: true });
  if (result.status.justCheckedIn) {
    revalidateCheckInPaths();
  }

  return {
    success: true as const,
    alreadyCheckedIn: result.status.alreadyCheckedIn,
    streak: result.status.streak,
  };
}

export async function completeChallenge(slug: string) {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const result = await completeChallengeBySlug(user.id, slug);

  if (!result.completed) {
    return { success: true, alreadyCompleted: true };
  }

  revalidatePath("/challenges");
  revalidatePath("/profile");
  return { success: true, alreadyCompleted: false, points: result.points };
}
