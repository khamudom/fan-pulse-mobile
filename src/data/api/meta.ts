import type { FanPulseApiMeta } from "@/types/mockApi";

export function fanPulseMeta(
  endpoint: string,
  cacheTtlSeconds = 300,
): FanPulseApiMeta {
  return {
    endpoint,
    version: "v1",
    generated_at: "2026-06-14T12:00:00Z",
    cache_ttl_seconds: cacheTtlSeconds,
  };
}
