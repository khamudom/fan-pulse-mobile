"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export const RESET_PASSWORD_PATH = "/login/reset-password";

function hasRecoveryAuthParams(url: URL): boolean {
  const params = url.searchParams;
  const hashParams = new URLSearchParams(url.hash.slice(1));

  return (
    params.has("code") ||
    params.has("token_hash") ||
    params.get("type") === "recovery" ||
    hashParams.get("type") === "recovery" ||
    url.pathname.startsWith("/auth/")
  );
}

function clearAuthParamsFromUrl() {
  window.history.replaceState({}, "", RESET_PASSWORD_PATH);
}

export function PasswordRecoveryListener() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        clearAuthParamsFromUrl();
        router.replace(RESET_PASSWORD_PATH);
      }
    });

    void (async () => {
      const url = new URL(window.location.href);
      if (!hasRecoveryAuthParams(url)) return;

      const params = url.searchParams;
      const code = params.get("code");
      const token_hash = params.get("token_hash");
      const type = params.get("type") as EmailOtpType | null;

      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
        return;
      }

      if (token_hash && type) {
        await supabase.auth.verifyOtp({ type, token_hash });
        return;
      }

      await supabase.auth.getSession();
    })();

    return () => subscription.unsubscribe();
  }, [router]);

  return null;
}
