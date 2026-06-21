/** Raw response shapes mirroring external API conventions (snake_case payloads). */

export interface FanPulseApiMeta {
  endpoint: string;
  version: string;
  generated_at: string;
  cache_ttl_seconds: number;
}

export interface ApiArticle {
  id: string;
  title_en: string;
  excerpt_en: string;
  category: string;
  published_at: string;
  image_url?: string;
  href?: string;
}

export interface ArticlesApiResponse {
  meta: FanPulseApiMeta;
  articles: ApiArticle[];
}

export interface ApiPlayer {
  id: string;
  name_en: string;
  team_id: string;
  team_name_en: string;
  stat_type: string;
  stat_value: string;
  leaderboard: string;
}

export interface PlayersApiResponse {
  meta: FanPulseApiMeta;
  players: ApiPlayer[];
}

export interface ApiMatchInsight {
  id: string;
  prompt_en: string;
  response_en: string;
}

export interface ApiTournamentInsight {
  id: string;
  title_en: string;
  body_en: string;
  category: string;
}

export interface ApiAiPrompt {
  id: string;
  prompt_en: string;
  response_en: string;
}

export interface InsightsApiResponse {
  meta: FanPulseApiMeta;
  match_insights: ApiMatchInsight[];
  tournament_insights: ApiTournamentInsight[];
  ai_prompts: ApiAiPrompt[];
}

export interface ApiPollOption {
  id: string;
  label_en: string;
  votes: number;
  percentage: number;
}

export interface ApiPoll {
  id: string;
  question_en: string;
  total_votes: number;
  options: ApiPollOption[];
}

export interface PollsApiResponse {
  meta: FanPulseApiMeta;
  polls: ApiPoll[];
}

export interface ApiPredictionOption {
  id: string;
  label_en: string;
  category: string;
}

export interface ApiPredictionTrend {
  id: string;
  label_en: string;
  value_en: string;
  percentage?: number;
}

export interface PredictionsApiResponse {
  meta: FanPulseApiMeta;
  champion_options: ApiPredictionOption[];
  golden_boot_options: ApiPredictionOption[];
  surprise_team_options: ApiPredictionOption[];
  trends: ApiPredictionTrend[];
  most_picked_champion: { team_name_en: string; percentage: number };
}

export interface ApiAnalyticsMetric {
  id: string;
  label_en: string;
  value: string | number;
  change_en?: string;
  trend?: string;
}

export interface ApiFanSentiment {
  team_name_en: string;
  confidence: number;
}

export interface ApiTrendingTeam {
  id: string;
  name_en: string;
  popularity_change_en: string;
  fan_confidence: number;
  prediction_percentage: number;
}

export interface ApiTimelineEvent {
  id: string;
  title_en: string;
  date_en: string;
  description_en: string;
  status: string;
}

export interface ApiGroupLeader {
  group: string;
  leader_name_en: string;
}

export interface AnalyticsApiResponse {
  meta: FanPulseApiMeta;
  metrics: ApiAnalyticsMetric[];
  fan_sentiment: ApiFanSentiment[];
  trending_teams: ApiTrendingTeam[];
  timeline: ApiTimelineEvent[];
  group_analysis: {
    leaders: ApiGroupLeader[];
    most_competitive_en: string;
    highest_scoring_en: string;
    most_surprising_en: string;
  };
  match_highlights: {
    most_viewed_en: string;
    highest_scoring_en: string;
    biggest_upset_en: string;
    closest_match_en: string;
  };
  host_city_insights: {
    most_active_city_en: string;
    featured_stadium_en: string;
    highest_scoring_stadium_en: string;
    upcoming_venue_en: string;
  };
  overview: {
    stage_en: string;
    matches_played: number;
    teams_remaining: number;
    total_predictions: number;
  };
}

export interface ApiStory {
  id: string;
  chapter: string;
  headline_en: string;
  teaser_en: string;
  hook_en: string;
  nation_en?: string;
  body_paragraphs_en: string[];
  publish_date: string;
}

export interface StoriesApiResponse {
  meta: FanPulseApiMeta;
  stories: ApiStory[];
}

export interface ApiTeamComparison {
  team_id: string;
  team_name_en: string;
  recent_form: string[];
  goals_scored: number;
  fan_confidence: number;
  key_player_en: string;
}

export interface MatchComparisonApiResponse {
  meta: FanPulseApiMeta;
  match_id: string;
  comparisons: ApiTeamComparison[];
}

export interface ApiGroupAdvanceTeam {
  group: string;
  team_name_en: string;
  slot: number;
}

export interface ApiKnockoutRound {
  round_en: string;
  matchups_en: string[];
}

export interface PredictorApiResponse {
  meta: FanPulseApiMeta;
  groups: string[];
  group_advance_teams: ApiGroupAdvanceTeam[];
  knockout_rounds: ApiKnockoutRound[];
}
