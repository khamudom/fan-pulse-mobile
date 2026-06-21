"use server";

import { getAuthContext } from "@/lib/auth";
import { generateBriefing } from "@/lib/ai/companion";
import {
  getBriefingTodayIso,
  getBriefingTodayMatches,
  getBriefingYesterdayMatches,
} from "@/lib/briefingContext";
import {
  getBriefingTimeZone,
  setBriefingTimeZoneCookie,
} from "@/lib/briefingTimeZone";
import { createClient } from "@/lib/supabase/server";
import { getFanJourney } from "@/lib/fanJourney";
import { getMatches } from "@/services/worldCupApi";

/** Persist the visitor timezone so briefing dates match their local calendar day. */
export async function syncBriefingTimeZone(timeZone: string): Promise<boolean> {
  return setBriefingTimeZoneCookie(timeZone);
}

export async function getCachedBriefing(): Promise<{
  content: string | null;
  error?: string;
}> {
  const { user } = await getAuthContext();
  if (!user) {
    return { content: null, error: "Sign in to read your briefing." };
  }

  const timeZone = await getBriefingTimeZone();
  if (!timeZone) {
    return { content: null };
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("daily_briefings")
    .select("content")
    .eq("user_id", user.id)
    .eq("briefing_date", getBriefingTodayIso(new Date(), timeZone))
    .maybeSingle();

  return { content: data?.content ?? null };
}

export async function getOrCreateDailyBriefing(): Promise<{
  content: string;
  cached: boolean;
  error?: string;
}> {
  const { user, profile, stats } = await getAuthContext();
  if (!user) {
    return { content: "", cached: false, error: "Sign in to read your briefing." };
  }

  const timeZone = await getBriefingTimeZone();
  if (!timeZone) {
    return {
      content: "",
      cached: false,
      error: "Could not determine your local date. Refresh and try again.",
    };
  }

  const now = new Date();
  const today = getBriefingTodayIso(now, timeZone);
  const supabase = await createClient();

  const { data: cached } = await supabase
    .from("daily_briefings")
    .select("content")
    .eq("user_id", user.id)
    .eq("briefing_date", today)
    .maybeSingle();

  if (cached?.content) {
    return { content: cached.content, cached: true };
  }

  const { data: matches } = await getMatches();
  const yesterdayMatches = getBriefingYesterdayMatches(matches, profile, now, timeZone);
  const todayMatches = getBriefingTodayMatches(matches, now, timeZone);
  const journey = getFanJourney(matches, profile, now);

  const content = await generateBriefing({
    userName: profile?.display_name ?? "Fan",
    profile,
    briefingDate: today,
    yesterdayMatches,
    todayMatches,
    upcomingTeamMatch: journey.nextMatch,
    stats: stats
      ? {
          points: stats.points,
          level: stats.level,
          predictionAccuracy: Number(stats.prediction_accuracy),
          streak: stats.current_streak,
        }
      : undefined,
  });

  await supabase.from("daily_briefings").upsert(
    {
      user_id: user.id,
      briefing_date: today,
      content,
    },
    { onConflict: "user_id,briefing_date" }
  );

  return { content, cached: false };
}

export async function getCompanionGreeting(): Promise<string> {
  const { user, profile, stats } = await getAuthContext();
  if (!user || !profile?.favorite_country) {
    return "Welcome to FanPulse — set up My World Cup to get personalized insights.";
  }

  const { data: matches } = await getMatches();
  const journey = getFanJourney(matches, profile);

  if (journey.nextMatch && journey.countdown) {
    const parts = [];
    parts.push(
      `Good morning, ${profile.display_name ?? "Fan"}. ${profile.favorite_country} plays in ${journey.countdown.days}d ${journey.countdown.hours}h ${journey.countdown.minutes}m.`
    );
    if (stats) {
      parts.push(
        `You're Level ${stats.level} with ${Number(stats.prediction_accuracy)}% prediction accuracy.`
      );
    }
    return parts.join(" ");
  }

  return `Welcome back, ${profile.display_name ?? "Fan"}. Follow ${profile.favorite_country} throughout the World Cup.`;
}
