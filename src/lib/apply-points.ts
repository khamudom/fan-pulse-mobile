import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";
import {
  computeLevel,
  POINT_VALUES,
  type PointEventType,
} from "@/lib/points";

export async function applyPoints(
  userId: string,
  type: PointEventType,
  points?: number,
  metadata: Json = {},
) {
  const pointValue =
    points ?? POINT_VALUES[type as keyof typeof POINT_VALUES] ?? 0;
  if (pointValue <= 0) return { error: "Invalid point value." };

  const supabase = await createClient();

  const { error: eventError } = await supabase.from("point_events").insert({
    user_id: userId,
    type,
    points: pointValue,
    metadata,
  });

  if (eventError) return { error: eventError.message };

  const { data: stats } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const newPoints = (stats?.points ?? 0) + pointValue;
  const newLevel = computeLevel(newPoints);

  const { error: statsError } = await supabase.from("user_stats").upsert(
    {
      user_id: userId,
      points: newPoints,
      level: newLevel,
      current_streak: stats?.current_streak ?? 0,
      last_check_in: stats?.last_check_in ?? null,
      prediction_accuracy: stats?.prediction_accuracy ?? 0,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (statsError) return { error: statsError.message };

  return { success: true, points: pointValue, total: newPoints, level: newLevel };
}
