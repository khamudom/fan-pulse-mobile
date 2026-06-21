import { contentData } from "@/services/contentApi";

const analytics = contentData.analytics;

export const mockDashboardMetrics = analytics.metrics;
export const mockFanSentiment = analytics.fanSentiment;
export const mockTrendingTeams = analytics.trendingTeams;
export const mockGroupAnalysis = {
  leaders: analytics.groupAnalysis.leaders,
  mostCompetitive: analytics.groupAnalysis.mostCompetitive,
  highestScoring: analytics.groupAnalysis.highestScoring,
  mostSurprising: analytics.groupAnalysis.mostSurprising,
};
export const mockMatchInsights = analytics.matchInsights;
export const mockHostCityInsights = analytics.hostCityInsights;
export const mockTimeline = analytics.timeline;
export const tournamentOverview = analytics.overview;
