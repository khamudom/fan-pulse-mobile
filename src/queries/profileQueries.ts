import type { QueryClient } from "@tanstack/react-query";

export const profileQueryKeys = {
  all: ["profile"] as const,
  detail: () => [...profileQueryKeys.all] as const,
  friends: () => [...profileQueryKeys.all, "friends"] as const,
};

export function invalidateProfile(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: profileQueryKeys.detail() });
  void queryClient.invalidateQueries({ queryKey: profileQueryKeys.friends() });
}
