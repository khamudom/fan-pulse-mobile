import { redirect } from "next/navigation";
import { Hero } from "@/components/display/Hero";
import { EditableDisplayName } from "@/components/EditableDisplayName";
import { ProfileDashboard } from "@/components/ProfileDashboard";
import { getAuthContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "My Profile",
};

export default async function ProfilePage() {
  const { user, profile, stats } = await getAuthContext();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { count: predictionCount } = await supabase
    .from("predictions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  return (
    <div className="page">
      <Hero
        title={
          <EditableDisplayName displayName={profile?.display_name ?? "Fan"} />
        }
        subtitle="Your FanPulse reputation — points, streaks, and prediction accuracy."
        compact
      />
      <section className="section">
        <div className="container">
          <ProfileDashboard
            profile={profile}
            stats={stats}
            predictionCount={predictionCount ?? 0}
          />
        </div>
      </section>
    </div>
  );
}
