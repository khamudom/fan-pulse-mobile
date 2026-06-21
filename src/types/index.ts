export type MatchStatus =
  | "scheduled"
  | "live"
  | "finished"
  | "notstarted"
  | "halftime"
  | "postponed";

export interface Team {
  id: string;
  name: string;
  nameFa?: string;
  flag?: string;
  fifaCode?: string;
  fifaSlug?: string;
  iso2?: string;
  group?: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  group?: string;
  matchday?: string;
  date: string;
  time: string;
  /** Absolute kickoff instant (ISO 8601 UTC), derived from venue-local schedule time. */
  kickoffUtc?: string;
  /** IANA timezone for the venue (e.g. America/Los_Angeles). */
  venueTimeZone?: string;
  stadiumId?: string;
  stadiumName?: string;
  city?: string;
  status: MatchStatus;
  type?: string;
}

export interface GroupStanding {
  teamId: string;
  teamName: string;
  flag?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface Group {
  name: string;
  standings: GroupStanding[];
}

export interface Stadium {
  id: string;
  name: string;
  fifaName?: string;
  city: string;
  country: string;
  capacity?: number;
  region?: string;
  matchCount?: number;
}

export interface PollOption {
  id: string;
  label: string;
  votes: number;
  percentage: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
}

export interface Prediction {
  id: string;
  champion?: string;
  goldenBoot?: string;
  surpriseTeam?: string;
  winner?: string;
  homeScore?: number;
  awayScore?: number;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  imageUrl?: string;
  href?: string;
}

export interface Insight {
  id: string;
  title: string;
  body: string;
  category?: string;
}

export interface AnalyticsMetric {
  id: string;
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export interface TrendingTeam {
  id: string;
  name: string;
  popularityChange: string;
  fanConfidence: number;
  predictionPercentage: number;
}

export interface PlayerStoryline {
  id: string;
  name: string;
  team: string;
  stat: string;
  value: string | number;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  status: "completed" | "current" | "upcoming";
}

export interface ApiResult<T> {
  data: T;
  source: "api";
  error?: string;
}
