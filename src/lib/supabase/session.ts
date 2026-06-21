import { AuthApiError } from "@supabase/supabase-js";

export function isStaleAuthSessionError(error: unknown): boolean {
  return (
    error instanceof AuthApiError &&
    (error.code === "refresh_token_not_found" ||
      error.code === "invalid_refresh_token")
  );
}
