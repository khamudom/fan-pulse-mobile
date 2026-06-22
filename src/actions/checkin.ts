"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth";
import { ensureDailyCheckIn } from "@/lib/checkin";

function revalidateCheckInPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/profile");
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
