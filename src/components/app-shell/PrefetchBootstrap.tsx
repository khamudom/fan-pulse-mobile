"use client";

import { useEffect } from "react";
import { usePrefetchRoutes } from "@/hooks/usePrefetchRoutes";

export function PrefetchBootstrap() {
  const { warmRoutes } = usePrefetchRoutes();

  useEffect(() => {
    warmRoutes();
  }, [warmRoutes]);

  return null;
}
