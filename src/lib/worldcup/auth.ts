import "server-only";

import {
  WORLD_CUP_API_ORIGIN,
  WORLD_CUP_REQUEST_TIMEOUT_MS,
} from "./config";

type AuthResponse = {
  token?: string;
};

const PLACEHOLDER_TOKEN_PATTERN =
  /^(your[_-]?token|changeme|placeholder|example|xxx+|<.*>)$/i;

let cachedToken: string | null = null;

function isUsableToken(token: string | undefined): token is string {
  if (!token) return false;
  const trimmed = token.trim();
  if (!trimmed) return false;
  return !PLACEHOLDER_TOKEN_PATTERN.test(trimmed);
}

function getStaticToken(): string | null {
  const token = process.env.WORLD_CUP_API_TOKEN?.trim();
  return isUsableToken(token) ? token : null;
}

function hasLoginCredentials(): boolean {
  const email = process.env.WORLD_CUP_API_EMAIL?.trim();
  const password = process.env.WORLD_CUP_API_PASSWORD;
  return Boolean(email && password);
}

async function loginForToken(): Promise<string> {
  const email = process.env.WORLD_CUP_API_EMAIL?.trim();
  const password = process.env.WORLD_CUP_API_PASSWORD;

  if (!email || !password) {
    throw new Error("WORLD_CUP_API_NOT_CONFIGURED");
  }

  const response = await fetch(`${WORLD_CUP_API_ORIGIN}/auth/authenticate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
    signal: AbortSignal.timeout(WORLD_CUP_REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`World Cup API auth failed (${response.status})`);
  }

  const data = (await response.json()) as AuthResponse;
  if (!isUsableToken(data.token)) {
    throw new Error("World Cup API auth response missing token");
  }

  return data.token;
}

export function clearWorldCupApiToken(): void {
  cachedToken = null;
}

export async function getWorldCupApiToken(
  forceRefresh = false,
): Promise<string | null> {
  if (!forceRefresh) {
    const staticToken = getStaticToken();
    if (staticToken) return staticToken;
  }

  if (!hasLoginCredentials()) {
    return forceRefresh ? null : getStaticToken();
  }

  if (!forceRefresh && cachedToken) return cachedToken;

  cachedToken = await loginForToken();
  return cachedToken;
}

export function hasWorldCupApiCredentials(): boolean {
  return Boolean(getStaticToken() || hasLoginCredentials());
}
