"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { normalizeBracketPayload } from "@/lib/bracket";
import { emitActivityEvent } from "@/lib/activityEvents";
import { awardPoints } from "@/actions/points";
import { POINT_VALUES } from "@/lib/points";
import type {
  BracketPredictionPayload,
  BracketWinnerPicks,
  GroupRankings,
  SavedBracketPrediction,
} from "@/types/bracket";
import type { Json } from "@/types/database";

function mapRow(row: {
  id: string;
  user_id: string;
  payload: Json;
  created_at: string;
  updated_at: string;
}): SavedBracketPrediction {
  return {
    id: row.id,
    userId: row.user_id,
    payload: normalizeBracketPayload(row.payload),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getMyBracketPrediction(): Promise<SavedBracketPrediction | null> {
  const user = await getSessionUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("bracket_predictions")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return data ? mapRow(data) : null;
}

export async function saveMyBracketPrediction(
  input: {
    winners: BracketWinnerPicks;
    groupRankings?: GroupRankings;
    thirdPlaceQualifiers?: string[];
    championTeamId?: string;
    championTeamName?: string;
  },
): Promise<{ success?: boolean; error?: string; isNew?: boolean }> {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const payload: BracketPredictionPayload = {
    winners: input.winners,
    groupRankings: input.groupRankings ?? {},
    thirdPlaceQualifiers: input.thirdPlaceQualifiers ?? [],
    championTeamId: input.championTeamId,
    championTeamName: input.championTeamName,
    updatedAt: new Date().toISOString(),
  };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("bracket_predictions")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("bracket_predictions")
      .update({
        payload: payload as unknown as Json,
        updated_at: payload.updatedAt,
      })
      .eq("id", existing.id);

    if (error) return { error: error.message };
    await emitActivityEvent(user.id, "bracket", {
      championTeamId: input.championTeamId,
      championTeamName: input.championTeamName,
    });
    revalidatePath("/predictor");
    revalidatePath("/profile");
    return { success: true, isNew: false };
  }

  const { error } = await supabase.from("bracket_predictions").insert({
    user_id: user.id,
    payload: payload as unknown as Json,
    updated_at: payload.updatedAt,
  });

  if (error) return { error: error.message };

  await emitActivityEvent(user.id, "bracket", {
    championTeamId: input.championTeamId,
    championTeamName: input.championTeamName,
  });

  await awardPoints("bracket_prediction", POINT_VALUES.prediction, {
    championTeamId: input.championTeamId,
  });

  revalidatePath("/predictor");
  revalidatePath("/profile");
  revalidatePath("/challenges");
  return { success: true, isNew: true };
}
