import { createClient } from "@/lib/supabase/server";
import { applyPoints } from "@/lib/apply-points";
import { computeLevel, POINT_VALUES } from "@/lib/points";
import type { UserStats } from "@/types/database";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export type DailyCheckInStatus = {
  justCheckedIn: boolean;
  alreadyCheckedIn: boolean;
  streak: number;
  pointsEarned: number;
};

export type DailyCheckInResult = {
  status: DailyCheckInStatus;
  stats: UserStats | null;
};

type EnsureDailyCheckInOptions = {
  awaitWrites?: boolean;
};

async function executeDailyCheckInWrites(
  userId: string,
  stats: UserStats | null,
  newStreak: number,
): Promise<void> {
  const supabase = await createClient();
  const today = todayIso();

  await supabase.from("user_stats").upsert(
    {
      user_id: userId,
      points: stats?.points ?? 0,
      level: stats?.level ?? 1,
      current_streak: newStreak,
      last_check_in: today,
      prediction_accuracy: stats?.prediction_accuracy ?? 0,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  await applyPoints(userId, "daily_check_in", POINT_VALUES.daily_check_in);

  const { data: checkInChallenge } = await supabase
    .from("challenges")
    .select("id")
    .eq("slug", "daily-check-in")
    .maybeSingle();

  if (checkInChallenge) {
    await supabase.from("challenge_completions").upsert(
      {
        user_id: userId,
        challenge_id: checkInChallenge.id,
        completed_date: today,
      },
      { onConflict: "user_id,challenge_id,completed_date" },
    );
  }
}

function buildOptimisticStats(
  userId: string,
  stats: UserStats | null,
  newStreak: number,
  pointsEarned: number,
): UserStats {
  const currentPoints = stats?.points ?? 0;
  const newPoints = currentPoints + pointsEarned;
  const today = todayIso();

  return {
    user_id: userId,
    points: newPoints,
    level: computeLevel(newPoints),
    current_streak: newStreak,
    last_check_in: today,
    prediction_accuracy: stats?.prediction_accuracy ?? 0,
    updated_at: new Date().toISOString(),
  };
}

export async function completeChallengeBySlug(
  userId: string,
  slug: string,
): Promise<{ completed: boolean; points: number }> {
  const supabase = await createClient();

  const { data: challenge } = await supabase
    .from("challenges")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (!challenge) return { completed: false, points: 0 };

  const today = todayIso();
  const { data: existing } = await supabase
    .from("challenge_completions")
    .select("id")
    .eq("user_id", userId)
    .eq("challenge_id", challenge.id)
    .eq("completed_date", today)
    .maybeSingle();

  if (existing) return { completed: false, points: 0 };

  const { error } = await supabase.from("challenge_completions").insert({
    user_id: userId,
    challenge_id: challenge.id,
    completed_date: today,
  });

  if (error) return { completed: false, points: 0 };

  await applyPoints(userId, "challenge", challenge.points, { slug });
  return { completed: true, points: challenge.points };
}

export async function ensureDailyCheckIn(
  userId: string,
  options: EnsureDailyCheckInOptions = {},
): Promise<DailyCheckInResult> {
  const { awaitWrites = false } = options;
  const supabase = await createClient();
  const { data: stats } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const today = todayIso();
  const currentStreak = stats?.current_streak ?? 0;

  if (stats?.last_check_in === today) {
    return {
      status: {
        justCheckedIn: false,
        alreadyCheckedIn: true,
        streak: currentStreak,
        pointsEarned: 0,
      },
      stats: stats ?? null,
    };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayIso = yesterday.toISOString().slice(0, 10);

  let newStreak = 1;
  if (stats?.last_check_in === yesterdayIso) {
    newStreak = currentStreak + 1;
  }

  const pointsEarned = POINT_VALUES.daily_check_in;
  const status: DailyCheckInStatus = {
    justCheckedIn: true,
    alreadyCheckedIn: false,
    streak: newStreak,
    pointsEarned,
  };
  const optimisticStats = buildOptimisticStats(
    userId,
    stats,
    newStreak,
    pointsEarned,
  );

  const writePromise = executeDailyCheckInWrites(userId, stats, newStreak);

  if (awaitWrites) {
    await writePromise;
  } else {
    void writePromise.catch((error) => {
      console.error("Daily check-in write failed:", error);
    });
  }

  return { status, stats: optimisticStats };
}
