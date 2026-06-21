import { redirect } from "next/navigation";
import { Geist_Mono } from "next/font/google";
import { LoginPageOpener } from "@/components/AuthModal";
import { getSessionUser, isSupabaseConfigured } from "@/lib/auth";
import styles from "./page.module.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sign in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; next?: string }>;
}) {
  const user = await getSessionUser();
  const { country, next } = await searchParams;
  const nextPath = next?.trim();

  if (user) {
    if (nextPath?.startsWith("/") && !nextPath.startsWith("//")) {
      redirect(nextPath);
    }
    redirect("/");
  }

  const pendingCountry = country?.trim() || undefined;

  return (
    <div className={`page ${styles.page} ${geistMono.variable}`}>
      <div className="container">
        {!isSupabaseConfigured() ? (
          <div className={styles.notice}>
            <h1>Supabase not configured</h1>
            <p>
              Copy <code>.env.example</code> to <code>.env.local</code> and add your Supabase
              project URL and anon key.
            </p>
          </div>
        ) : (
          <LoginPageOpener country={pendingCountry} nextPath={nextPath} />
        )}
      </div>
    </div>
  );
}
