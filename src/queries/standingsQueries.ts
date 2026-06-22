import type { QueryClient } from "@tanstack/react-query";
import type { ApiResult, Group } from "@/types";

export const standingsQueryKeys = {
  all: ["groups"] as const,
  list: () => [...standingsQueryKeys.all] as const,
};

async function fetchGroups(): Promise<ApiResult<Group[]>> {
  const res = await fetch("/api/worldcup/groups");
  if (!res.ok) {
    throw new Error("Failed to fetch groups");
  }
  return res.json();
}

export function groupsQueryOptions() {
  return {
    queryKey: standingsQueryKeys.list(),
    queryFn: fetchGroups,
    staleTime: 5 * 60_000,
  };
}

export function prefetchGroups(queryClient: QueryClient) {
  return queryClient.prefetchQuery(groupsQueryOptions());
}

export { fetchGroups };
