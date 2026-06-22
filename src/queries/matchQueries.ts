import type { QueryClient } from "@tanstack/react-query";
import type { ApiResult, Match } from "@/types";

export type MatchFetchMode = "cached" | "fresh";

export const matchQueryKeys = {
  all: ["matches"] as const,
  list: (mode: MatchFetchMode = "cached") => [...matchQueryKeys.all, mode] as const,
  detail: (id: string, mode: MatchFetchMode = "cached") =>
    [...matchQueryKeys.all, "detail", id, mode] as const,
};

async function fetchMatches(mode: MatchFetchMode = "cached"): Promise<ApiResult<Match[]>> {
  const url = mode === "fresh" ? "/api/worldcup/matches?fresh=1" : "/api/worldcup/matches";
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch matches");
  }
  return res.json();
}

async function fetchMatchById(
  id: string,
  mode: MatchFetchMode = "cached",
): Promise<ApiResult<Match | null>> {
  const url =
    mode === "fresh"
      ? `/api/worldcup/matches/${id}?fresh=1`
      : `/api/worldcup/matches/${id}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch match");
  }
  return res.json();
}

export function matchesQueryOptions(mode: MatchFetchMode = "cached") {
  return {
    queryKey: matchQueryKeys.list(mode),
    queryFn: () => fetchMatches(mode),
    staleTime: mode === "fresh" ? 15_000 : 60_000,
  };
}

export function matchDetailQueryOptions(id: string, mode: MatchFetchMode = "cached") {
  return {
    queryKey: matchQueryKeys.detail(id, mode),
    queryFn: () => fetchMatchById(id, mode),
    staleTime: mode === "fresh" ? 15_000 : 60_000,
  };
}

export function prefetchMatches(queryClient: QueryClient) {
  return queryClient.prefetchQuery(matchesQueryOptions("cached"));
}

export { fetchMatches, fetchMatchById };
