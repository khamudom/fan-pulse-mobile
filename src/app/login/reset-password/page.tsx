import { ResetPasswordPageClient } from "@/components/ResetPasswordForm/ResetPasswordPageClient";
import { isSupabaseConfigured } from "@/lib/auth";
import styles from "../page.module.css";

export const metadata = {
  title: "Reset password",
};

export default function ResetPasswordPage() {
  return (
    <div className={`page ${styles.page}`}>
      <div className="container">
        {!isSupabaseConfigured() ? (
          <div className={styles.notice}>
            <h1>Supabase not configured</h1>
            <p>
              Copy <code>.env.example</code> to <code>.env.local</code> and add
              your Supabase project URL and anon key.
            </p>
          </div>
        ) : (
          <ResetPasswordPageClient />
        )}
      </div>
    </div>
  );
}
