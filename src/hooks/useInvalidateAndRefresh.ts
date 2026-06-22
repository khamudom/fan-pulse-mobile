"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useInvalidateAndRefresh() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useCallback(
    (queryKeys?: string[][]) => {
      if (queryKeys?.length) {
        for (const key of queryKeys) {
          void queryClient.invalidateQueries({ queryKey: key });
        }
      }
      router.refresh();
    },
    [queryClient, router],
  );
}
