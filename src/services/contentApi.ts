import { analyticsApiResponse } from "@/data/api/analytics";
import { articlesApiResponse } from "@/data/api/articles";
import {
  defaultMatchComparisonResponse,
  matchComparisonApiResponse,
} from "@/data/api/comparisons";
import { insightsApiResponse } from "@/data/api/insights";
import { playersApiResponse } from "@/data/api/players";
import { pollsApiResponse } from "@/data/api/polls";
import { predictionsApiResponse } from "@/data/api/predictions";
import { predictorApiResponse } from "@/data/api/predictor";
import { storiesApiResponse } from "@/data/api/stories";
import type {
  AnalyticsMetric,
  Article,
  Insight,
  PlayerStoryline,
  Poll,
  TimelineEvent,
  TrendingTeam,
} from "@/types";
import type {
  ApiArticle,
  ApiPlayer,
  ApiStory,
  ApiTeamComparison,
  FanPulseApiMeta,
} from "@/types/mockApi";

export interface ContentApiResult<T> {
  data: T;
  source: "mock";
  endpoint: string;
  meta: FanPulseApiMeta;
}

export interface WorldCupStory {
  id: string;
  headline: string;
  teaser: string;
  hook: string;
  nation?: string;
  chapter: string;
  fullStory: string[];
}

export interface TeamComparisonStats {
  teamId: string;
  teamName: string;
  form: string[];
  goalsScored: number;
  fanConfidence: number;
  keyPlayer: string;
}

export interface PredictorGroupData {
  groups: string[];
  advanceTeams: Record<string, string[]>;
  knockoutRounds: { round: string; matchups: string[] }[];
}

export interface PredictionTrends {
  mostPickedChampion: { team: string; percentage: number };
  trends: Record<string, string>;
}

function result<T>(
  data: T,
  meta: FanPulseApiMeta,
): ContentApiResult<T> {
  return { data, source: "mock", endpoint: meta.endpoint, meta };
}

function mapArticle(api: ApiArticle): Article {
  return {
    id: api.id,
    title: api.title_en,
    excerpt: api.excerpt_en,
    category: api.category,
    publishedAt: api.published_at.slice(0, 10),
    imageUrl: api.image_url,
    href: api.href,
  };
}

function mapPlayer(api: ApiPlayer): PlayerStoryline {
  const statLabel =
    api.stat_type === "goals"
      ? "Goals"
      : api.stat_type === "assists"
        ? "Assists"
        : api.stat_type === "mentions"
          ? "Mentions"
          : api.stat_type;

  const value =
    api.stat_type === "mentions"
      ? `${(parseInt(api.stat_value, 10) / 1000).toFixed(1)}K`
      : api.stat_value;

  return {
    id: api.id,
    name: api.name_en,
    team: api.team_name_en,
    stat: statLabel,
    value,
  };
}

function mapStory(api: ApiStory): WorldCupStory {
  return {
    id: api.id,
    chapter: api.chapter,
    headline: api.headline_en,
    teaser: api.teaser_en,
    hook: api.hook_en,
    nation: api.nation_en,
    fullStory: api.body_paragraphs_en,
  };
}

function mapComparison(api: ApiTeamComparison): TeamComparisonStats {
  return {
    teamId: api.team_id,
    teamName: api.team_name_en,
    form: api.recent_form,
    goalsScored: api.goals_scored,
    fanConfidence: api.fan_confidence,
    keyPlayer: api.key_player_en,
  };
}

export function getArticles(): ContentApiResult<Article[]> {
  const { meta, articles } = articlesApiResponse;
  return result(articles.map(mapArticle), meta);
}

export function getPlayers(
  leaderboard?: string,
): ContentApiResult<PlayerStoryline[]> {
  const { meta, players } = playersApiResponse;
  const filtered = leaderboard
    ? players.filter((p) => p.leaderboard === leaderboard)
    : players;
  return result(filtered.map(mapPlayer), meta);
}

export function getFollowablePlayers(): ContentApiResult<PlayerStoryline[]> {
  const { meta, players } = playersApiResponse;
  const followable = players.filter((p) => p.leaderboard === "followable");
  const leaderboardPlayers = players.filter(
    (p) => p.leaderboard !== "followable",
  );

  const seen = new Set<string>();
  const deduped = [...leaderboardPlayers, ...followable].filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  return result(deduped.map(mapPlayer), meta);
}

export function getMatchInsights(): ContentApiResult<Record<string, string>> {
  const { meta, match_insights } = insightsApiResponse;
  const data = Object.fromEntries(
    match_insights.map((i) => [i.prompt_en, i.response_en]),
  );
  return result(data, meta);
}

export function getTournamentInsights(): ContentApiResult<Insight[]> {
  const { meta, tournament_insights } = insightsApiResponse;
  return result(
    tournament_insights.map((i) => ({
      id: i.id,
      title: i.title_en,
      body: i.body_en,
      category: i.category,
    })),
    meta,
  );
}

export function getAiPrompts(): ContentApiResult<{
  prompts: string[];
  responses: Record<string, string>;
}> {
  const { meta, ai_prompts } = insightsApiResponse;
  return result(
    {
      prompts: ai_prompts.map((p) => p.prompt_en),
      responses: Object.fromEntries(
        ai_prompts.map((p) => [p.prompt_en, p.response_en]),
      ),
    },
    meta,
  );
}

export function getPolls(): ContentApiResult<Poll[]> {
  const { meta, polls } = pollsApiResponse;
  return result(
    polls.map((poll) => ({
      id: poll.id,
      question: poll.question_en,
      totalVotes: poll.total_votes,
      options: poll.options.map((o) => ({
        id: o.id,
        label: o.label_en,
        votes: o.votes,
        percentage: o.percentage,
      })),
    })),
    meta,
  );
}

export function getPredictionOptions(): ContentApiResult<{
  championOptions: string[];
  goldenBootOptions: string[];
  surpriseTeamOptions: string[];
}> {
  const { meta, champion_options, golden_boot_options, surprise_team_options } =
    predictionsApiResponse;
  return result(
    {
      championOptions: champion_options.map((o) => o.label_en),
      goldenBootOptions: golden_boot_options.map((o) => o.label_en),
      surpriseTeamOptions: surprise_team_options.map((o) => o.label_en),
    },
    meta,
  );
}

export function getPredictionTrends(): ContentApiResult<PredictionTrends> {
  const { meta, trends, most_picked_champion } = predictionsApiResponse;
  return result(
    {
      mostPickedChampion: {
        team: most_picked_champion.team_name_en,
        percentage: most_picked_champion.percentage,
      },
      trends: Object.fromEntries(
        trends.map((t) => [t.label_en, t.value_en]),
      ),
    },
    meta,
  );
}

export function getAnalyticsDashboard(): ContentApiResult<{
  metrics: AnalyticsMetric[];
  fanSentiment: { team: string; confidence: number }[];
  trendingTeams: TrendingTeam[];
  timeline: TimelineEvent[];
  groupAnalysis: {
    leaders: { group: string; leader: string }[];
    mostCompetitive: string;
    highestScoring: string;
    mostSurprising: string;
  };
  matchInsights: Record<string, string>;
  hostCityInsights: Record<string, string>;
  overview: {
    stage: string;
    matchesPlayed: number;
    teamsRemaining: number;
    totalPredictions: number;
  };
}> {
  const {
    meta,
    metrics,
    fan_sentiment,
    trending_teams,
    timeline,
    group_analysis,
    match_highlights,
    host_city_insights,
    overview,
  } = analyticsApiResponse;

  return result(
    {
      metrics: metrics.map((m) => ({
        id: m.id,
        label: m.label_en,
        value: m.value,
        change: m.change_en,
        trend: m.trend as AnalyticsMetric["trend"],
      })),
      fanSentiment: fan_sentiment.map((s) => ({
        team: s.team_name_en,
        confidence: s.confidence,
      })),
      trendingTeams: trending_teams.map((t) => ({
        id: t.id,
        name: t.name_en,
        popularityChange: t.popularity_change_en,
        fanConfidence: t.fan_confidence,
        predictionPercentage: t.prediction_percentage,
      })),
      timeline: timeline.map((e) => ({
        id: e.id,
        title: e.title_en,
        date: e.date_en,
        description: e.description_en,
        status: e.status as TimelineEvent["status"],
      })),
      groupAnalysis: {
        leaders: group_analysis.leaders.map((l) => ({
          group: l.group,
          leader: l.leader_name_en,
        })),
        mostCompetitive: group_analysis.most_competitive_en,
        highestScoring: group_analysis.highest_scoring_en,
        mostSurprising: group_analysis.most_surprising_en,
      },
      matchInsights: {
        mostViewed: match_highlights.most_viewed_en,
        highestScoring: match_highlights.highest_scoring_en,
        biggestUpset: match_highlights.biggest_upset_en,
        closestMatch: match_highlights.closest_match_en,
      },
      hostCityInsights: {
        mostActiveCity: host_city_insights.most_active_city_en,
        featuredStadium: host_city_insights.featured_stadium_en,
        highestScoringStadium: host_city_insights.highest_scoring_stadium_en,
        upcomingVenue: host_city_insights.upcoming_venue_en,
      },
      overview: {
        stage: overview.stage_en,
        matchesPlayed: overview.matches_played,
        teamsRemaining: overview.teams_remaining,
        totalPredictions: overview.total_predictions,
      },
    },
    meta,
  );
}

export function getStories(): ContentApiResult<WorldCupStory[]> {
  const { meta, stories } = storiesApiResponse;
  return result(stories.map(mapStory), meta);
}

export function getTodaysStory(date = new Date()): ContentApiResult<WorldCupStory> {
  const { data: stories, meta } = getStories();
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor(
    (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  const index = day % stories.length;
  return { data: stories[index], source: "mock", endpoint: meta.endpoint, meta };
}

export function getMatchComparison(
  matchId?: string,
  homeTeamName?: string,
  awayTeamName?: string,
): ContentApiResult<TeamComparisonStats[]> {
  const response =
    matchId && homeTeamName && awayTeamName
      ? matchComparisonApiResponse(matchId, homeTeamName, awayTeamName)
      : defaultMatchComparisonResponse;

  return result(
    response.comparisons.map(mapComparison),
    response.meta,
  );
}

export function getPredictorData(): ContentApiResult<PredictorGroupData> {
  const { meta, groups, group_advance_teams, knockout_rounds } =
    predictorApiResponse;

  const advanceTeams = group_advance_teams.reduce<Record<string, string[]>>(
    (acc, entry) => {
      const list = acc[entry.group] ?? [];
      list.push(entry.team_name_en);
      acc[entry.group] = list;
      return acc;
    },
    {},
  );

  return result(
    {
      groups,
      advanceTeams,
      knockoutRounds: knockout_rounds.map((r) => ({
        round: r.round_en,
        matchups: r.matchups_en,
      })),
    },
    meta,
  );
}

/** Synchronous accessors for client components and legacy imports. */
export const contentData = {
  articles: getArticles().data,
  followablePlayers: getFollowablePlayers().data,
  matchInsights: getMatchInsights().data,
  tournamentInsights: getTournamentInsights().data,
  aiPrompts: getAiPrompts().data.prompts,
  aiResponses: getAiPrompts().data.responses,
  polls: getPolls().data,
  worldCupWinnerPoll: getPolls().data[0],
  predictionOptions: getPredictionOptions().data,
  predictionTrends: getPredictionTrends().data,
  analytics: getAnalyticsDashboard().data,
  stories: getStories().data,
  predictor: getPredictorData().data,
};
