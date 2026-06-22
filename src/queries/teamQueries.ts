import type { QueryClient } from "@tanstack/react-query";
import type { ApiResult, Team } from "@/types";

export const teamQueryKeys = {
  all: ["teams"] as const,
  list: () => [...teamQueryKeys.all] as const,
};

async function fetchTeams(): Promise<ApiResult<Team[]>> {
  const res = await fetch("/api/worldcup/teams");
  if (!res.ok) {
    throw new Error("Failed to fetch teams");
  }
  return res.json();
}

export function teamsQueryOptions() {
  return {
    queryKey: teamQueryKeys.list(),
    queryFn: fetchTeams,
    staleTime: 5 * 60_000,
  };
}

export function prefetchTeams(queryClient: QueryClient) {
  return queryClient.prefetchQuery(teamsQueryOptions());
}

export { fetchTeams };
