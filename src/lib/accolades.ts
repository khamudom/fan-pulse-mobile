import type { UserStats } from "@/types/database";

export type AccoladeCategory = "points" | "streak" | "level";

export interface Accolade {
  id: string;
  emoji: string;
  title: string;
  tagline: string;
  category: AccoladeCategory;
  threshold: number;
}

export const FAN_ACCOLADES: Accolade[] = [
  {
    id: "first-touch",
    emoji: "🦶",
    title: "First Touch",
    tagline: "Clumsy, but charming — every legend starts here.",
    category: "points",
    threshold: 10,
  },
  {
    id: "corner-flag",
    emoji: "🚩",
    title: "Corner Flag Waver",
    tagline: "You're on the edge of the pitch, but you're in the story.",
    category: "points",
    threshold: 50,
  },
  {
    id: "sub-on",
    emoji: "👟",
    title: "Sub On",
    tagline: "Coach just waved you on. The crowd goes wild!",
    category: "points",
    threshold: 100,
  },
  {
    id: "midfield-maestro",
    emoji: "⚽",
    title: "Midfield Maestro",
    tagline: "Pulling strings like a puppet master of the beautiful game.",
    category: "points",
    threshold: 250,
  },
  {
    id: "golden-boot",
    emoji: "🥅",
    title: "Golden Boot Hopeful",
    tagline: "The scouts are whispering your name in the press box.",
    category: "points",
    threshold: 500,
  },
  {
    id: "captains-armband",
    emoji: "©️",
    title: "Captain's Armband",
    tagline: "Your team looks to you now. Lead with heart.",
    category: "points",
    threshold: 1000,
  },
  {
    id: "trophy-room",
    emoji: "🏆",
    title: "Trophy Room Regular",
    tagline: "Your shelf is getting crowded with shiny things.",
    category: "points",
    threshold: 2500,
  },
  {
    id: "legend-stands",
    emoji: "📣",
    title: "Legend of the Stands",
    tagline: "They sing songs about you in the concourse.",
    category: "points",
    threshold: 5000,
  },
  {
    id: "hat-trick-habit",
    emoji: "🔥",
    title: "Hat Trick Habit",
    tagline: "Three days in a row — you're on fire!",
    category: "streak",
    threshold: 3,
  },
  {
    id: "weekly-warrior",
    emoji: "📅",
    title: "Weekly Warrior",
    tagline: "Seven days of pure fan devotion. Respect.",
    category: "streak",
    threshold: 7,
  },
  {
    id: "fortnight-fanatic",
    emoji: "🎟️",
    title: "Fortnight Fanatic",
    tagline: "Two weeks strong. The turnstiles know your face.",
    category: "streak",
    threshold: 14,
  },
  {
    id: "season-ticket",
    emoji: "🏟️",
    title: "Season Ticket Holder",
    tagline: "Thirty days. You basically live here now.",
    category: "streak",
    threshold: 30,
  },
  {
    id: "rising-star",
    emoji: "⭐",
    title: "Rising Star",
    tagline: "The spotlight found you. Keep shining.",
    category: "level",
    threshold: 5,
  },
  {
    id: "stadium-regular",
    emoji: "🎪",
    title: "Stadium Regular",
    tagline: "You know where the good snacks are.",
    category: "level",
    threshold: 10,
  },
  {
    id: "world-cup-wanderer",
    emoji: "🌍",
    title: "World Cup Wanderer",
    tagline: "You've seen it all. The globe is your pitch.",
    category: "level",
    threshold: 20,
  },
];

function getStatValue(stats: UserStats, category: AccoladeCategory): number {
  switch (category) {
    case "points":
      return stats.points;
    case "streak":
      return stats.current_streak;
    case "level":
      return stats.level;
  }
}

export function isAccoladeEarned(accolade: Accolade, stats: UserStats): boolean {
  return getStatValue(stats, accolade.category) >= accolade.threshold;
}

export function getAccoladeCriteria(accolade: Accolade): string {
  switch (accolade.category) {
    case "points":
      return `${accolade.threshold.toLocaleString()} points`;
    case "streak":
      return `${accolade.threshold}-day streak`;
    case "level":
      return `Level ${accolade.threshold}`;
  }
}

export function getAccoladeProgress(
  accolade: Accolade,
  stats: UserStats,
): number {
  const current = getStatValue(stats, accolade.category);
  if (current >= accolade.threshold) return 100;
  return Math.round((current / accolade.threshold) * 100);
}

export interface AccoladeBoard {
  earned: Accolade[];
  locked: Accolade[];
  next: Accolade | null;
  nextRemaining: number;
  nextProgress: number;
}

export function getAccoladeBoard(stats: UserStats | null): AccoladeBoard {
  if (!stats) {
    return {
      earned: [],
      locked: FAN_ACCOLADES,
      next: FAN_ACCOLADES[0] ?? null,
      nextRemaining: FAN_ACCOLADES[0]?.threshold ?? 0,
      nextProgress: 0,
    };
  }

  const earned = FAN_ACCOLADES.filter((a) => isAccoladeEarned(a, stats));
  const locked = FAN_ACCOLADES.filter((a) => !isAccoladeEarned(a, stats));

  const nextCandidates = locked
    .map((accolade) => {
      const current = getStatValue(stats, accolade.category);
      const remaining = accolade.threshold - current;
      return { accolade, remaining, current };
    })
    .filter(({ remaining }) => remaining > 0)
    .sort((a, b) => a.remaining - b.remaining);

  const nextEntry = nextCandidates[0];
  const next = nextEntry?.accolade ?? null;
  const nextRemaining = nextEntry?.remaining ?? 0;
  const nextProgress = next
    ? getAccoladeProgress(next, stats)
    : 100;

  return { earned, locked, next, nextRemaining, nextProgress };
}

export function getStreakMessage(streak: number): string {
  if (streak >= 30) return "You're basically a season ticket holder!";
  if (streak >= 14) return "The turnstiles know your name.";
  if (streak >= 7) return "A full week of fan magic — keep it going!";
  if (streak >= 3) return "Hat trick of visits — you're on fire!";
  if (streak === 1) return "Day one of something wonderful.";
  return "Start your streak — the pitch awaits!";
}
