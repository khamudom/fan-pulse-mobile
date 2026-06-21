import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Hero } from "@/components/display/Hero";
import {
  FriendsRosterAsync,
  FriendsRosterSkeleton,
} from "@/features/friends/components/FriendsPage";
import { UsernamePrompt } from "@/features/friends/components/UsernamePrompt";
import { getAuthContext } from "@/lib/auth";

export const metadata = {
  title: "Friends",
};

export default async function FriendsPage() {
  const { user, profile } = await getAuthContext();
  if (!user) redirect("/login?next=/friends");

  return (
    <div className="page">
      <Hero
        title="Friends"
        subtitle="Connect with fellow fans, compare standings, and see who's backing which nation."
        compact
      />
      <section className="section">
        <div className="container">
          {!profile?.username ? (
            <UsernamePrompt />
          ) : (
            <Suspense fallback={<FriendsRosterSkeleton />}>
              <FriendsRosterAsync />
            </Suspense>
          )}
        </div>
      </section>
    </div>
  );
}
