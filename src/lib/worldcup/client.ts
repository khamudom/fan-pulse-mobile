import "server-only";
import { getWorldCupApiToken, clearWorldCupApiToken } from "./auth";
import {
  WORLD_CUP_API_AUTH_REQUIRED,
  WORLD_CUP_API_BASE,
  WORLD_CUP_GAMES_TIMEOUT_MS,
  WORLD_CUP_LIVE_REVALIDATE_SECONDS,
  WORLD_CUP_MAX_RETRIES,
  WORLD_CUP_PUBLIC_GET_API,
  WORLD_CUP_REQUEST_TIMEOUT_MS,
  WORLD_CUP_RETRY_DELAY_MS,
  WORLD_CUP_STABLE_REVALIDATE_SECONDS,
} from "./config";
import { worldCupCacheTags, type WorldCupCacheTag } from "./tags";

export type WorldCupResource = "teams" | "games" | "groups" | "stadiums";

export type WorldCupFetchMode = "cached" | "fresh";

type WorldCupFetchOptions = {
  mode?: WorldCupFetchMode;
};

export class WorldCupFetchError extends Error {
  readonly resource: WorldCupResource;
  readonly cause?: unknown;

  constructor(resource: WorldCupResource, message: string, cause?: unknown) {
    super(message);
    this.name = "WorldCupFetchError";
    this.resource = resource;
    this.cause = cause;
  }
}

const resourceTags: Record<WorldCupResource, WorldCupCacheTag> = {
  teams: worldCupCacheTags.teams,
  games: worldCupCacheTags.games,
  groups: worldCupCacheTags.groups,
  stadiums: worldCupCacheTags.stadiums,
};

function getRequestTimeoutMs(resource: WorldCupResource): number {
  return resource === "games"
    ? WORLD_CUP_GAMES_TIMEOUT_MS
    : WORLD_CUP_REQUEST_TIMEOUT_MS;
}

function isRetryable(error: unknown): boolean {
  if (!(error instanceof Error)) return true;
  const code = (error as NodeJS.ErrnoException).code;
  if (
    code === "ECONNRESET" ||
    code === "ETIMEDOUT" ||
    code === "ECONNREFUSED" ||
    code === "ENOTFOUND" ||
    error.name === "TimeoutError" ||
    error.name === "AbortError"
  ) {
    return true;
  }
  return /ssl|fetch failed|socket hang up|network/i.test(error.message);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getCacheConfig(resource: WorldCupResource, mode: WorldCupFetchMode) {
  if (mode === "fresh") {
    return { cache: "no-store" as const };
  }

  const revalidate =
    resource === "games"
      ? WORLD_CUP_LIVE_REVALIDATE_SECONDS
      : WORLD_CUP_STABLE_REVALIDATE_SECONDS;

  return {
    next: {
      revalidate,
      tags: [worldCupCacheTags.all, resourceTags[resource]],
    },
  };
}

async function resolveAuthToken(): Promise<string | null> {
  if (WORLD_CUP_PUBLIC_GET_API) {
    return null;
  }
  return getWorldCupApiToken();
}

async function fetchWorldCupOnce<T>(
  resource: WorldCupResource,
  mode: WorldCupFetchMode,
  token: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": "FanPulse/1.0 (+https://github.com/khamudom/fan-pulse-world-cup-2026)",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${WORLD_CUP_API_BASE}/${resource}`, {
    ...getCacheConfig(resource, mode),
    headers,
    signal: AbortSignal.timeout(getRequestTimeoutMs(resource)),
  });

  if (response.status === 401) {
    throw new WorldCupFetchError(
      resource,
      WORLD_CUP_API_AUTH_REQUIRED,
    );
  }

  if (!response.ok) {
    throw new WorldCupFetchError(
      resource,
      `World Cup API responded with ${response.status}`,
    );
  }

  return (await response.json()) as T;
}

export async function fetchWorldCupResource<T>(
  resource: WorldCupResource,
  options: WorldCupFetchOptions = {},
): Promise<T> {
  const mode = options.mode ?? "cached";
  let token = await resolveAuthToken();
  let refreshedAuth = false;
  let lastError: unknown;

  for (let attempt = 0; attempt <= WORLD_CUP_MAX_RETRIES; attempt += 1) {
    try {
      return await fetchWorldCupOnce<T>(resource, mode, token);
    } catch (error) {
      lastError = error;

      if (
        !WORLD_CUP_PUBLIC_GET_API &&
        error instanceof WorldCupFetchError &&
        error.message === WORLD_CUP_API_AUTH_REQUIRED &&
        !refreshedAuth
      ) {
        clearWorldCupApiToken();
        refreshedAuth = true;
        try {
          token = await getWorldCupApiToken(true);
        } catch (authError) {
          lastError = authError;
          break;
        }
        continue;
      }

      if (
        !WORLD_CUP_PUBLIC_GET_API &&
        error instanceof WorldCupFetchError &&
        error.message === WORLD_CUP_API_AUTH_REQUIRED &&
        refreshedAuth &&
        token
      ) {
        token = null;
        continue;
      }

      if (attempt === WORLD_CUP_MAX_RETRIES || !isRetryable(error)) {
        break;
      }
      await sleep(WORLD_CUP_RETRY_DELAY_MS * (attempt + 1));
    }
  }

  const message =
    lastError instanceof Error
      ? lastError.message
      : "World Cup API request failed";

  throw new WorldCupFetchError(resource, message, lastError);
}
