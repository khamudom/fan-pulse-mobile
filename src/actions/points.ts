"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { applyPoints } from "@/lib/apply-points";
import { completeChallengeBySlug } from "@/lib/checkin";
import { emitActivityEvent } from "@/lib/activityEvents";
import type { Json } from "@/types/database";
import {
  POINT_VALUES,
  type PointEventType,
} from "@/lib/points";

export async function awardPoints(
  type: PointEventType,
  points?: number,
  metadata: Json = {}
) {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const result = await applyPoints(user.id, type, points, metadata);
  if ("error" in result) return result;

  revalidatePath("/", "layout");
  revalidatePath("/profile");
  return result;
}

export async function getMyMatchPrediction(
  matchId: string
): Promise<{ home: number; away: number } | null> {
  const user = await getSessionUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("predictions")
    .select("predicted_home, predicted_away")
    .eq("user_id", user.id)
    .eq("match_id", matchId)
    .maybeSingle();

  return data
    ? { home: data.predicted_home, away: data.predicted_away }
    : null;
}

export async function savePrediction(
  matchId: string,
  predictedHome: number,
  predictedAway: number
) {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("predictions")
    .select("id")
    .eq("user_id", user.id)
    .eq("match_id", matchId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("predictions")
      .update({ predicted_home: predictedHome, predicted_away: predictedAway })
      .eq("id", existing.id);
    if (error) return { error: error.message };
    revalidatePath("/predictor");
    return { success: true, isNew: false };
  }

  const { error } = await supabase.from("predictions").insert({
    user_id: user.id,
    match_id: matchId,
    predicted_home: predictedHome,
    predicted_away: predictedAway,
  });

  if (error) return { error: error.message };

  await emitActivityEvent(user.id, "prediction", {
    matchId,
    predictedHome,
    predictedAway,
  });

  await awardPoints("prediction", POINT_VALUES.prediction, { matchId });

  await completeChallengeBySlug(user.id, "predict-today");

  revalidatePath("/predictor");
  revalidatePath("/challenges");
  return { success: true, isNew: true };
}

export async function recalculateAccuracy() {
  const user = await getSessionUser();
  if (!user) return;

  const supabase = await createClient();
  const { data: predictions } = await supabase
    .from("predictions")
    .select("correct")
    .eq("user_id", user.id)
    .eq("resolved", true);

  const resolved = predictions ?? [];
  const correct = resolved.filter((p) => p.correct).length;
  const accuracy =
    resolved.length === 0 ? 0 : Math.round((correct / resolved.length) * 1000) / 10;

  await supabase
    .from("user_stats")
    .update({ prediction_accuracy: accuracy, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);
}
