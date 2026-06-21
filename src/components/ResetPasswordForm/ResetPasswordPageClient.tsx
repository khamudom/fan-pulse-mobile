"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { RESET_PASSWORD_PATH } from "@/components/AuthModal/PasswordRecoveryListener";
import { createClient } from "@/lib/supabase/client";
import { ResetPasswordForm } from "./ResetPasswordForm";
import styles from "../LoginForm/LoginForm.module.css";

type ResetStatus = "loading" | "ready" | "unauthenticated";

export function ResetPasswordPageClient() {
  const router = useRouter();
  const [status, setStatus] = useState<ResetStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    async function establishSession() {
      const supabase = createClient();
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const token_hash = params.get("token_hash");
      const type = params.get("type") as EmailOtpType | null;

      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      } else if (token_hash && type) {
        await supabase.auth.verifyOtp({ type, token_hash });
      }

      if (code || token_hash) {
        window.history.replaceState({}, "", RESET_PASSWORD_PATH);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) return;
      setStatus(user ? "ready" : "unauthenticated");
    }

    void establishSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?error=auth");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p className={styles.forgotHint}>Preparing password reset…</p>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <ResetPasswordForm />;
}
