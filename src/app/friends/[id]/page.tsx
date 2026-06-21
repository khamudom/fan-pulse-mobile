import { notFound, redirect } from "next/navigation";
import { Hero } from "@/components/display/Hero";
import { FriendDetail } from "@/features/friends";
import { getFriendProfile } from "@/actions/social";
import { getSessionUser } from "@/lib/auth";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getFriendProfile(id);
  const name = profile?.displayName ?? profile?.username ?? "Fan";
  return { title: `${name} · Friends` };
}

export default async function FriendDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/friends");

  const { id } = await params;
  const profile = await getFriendProfile(id);

  if (!profile) notFound();

  const name = profile.displayName ?? profile.username ?? "Fan";

  return (
    <div className="page">
      <Hero title={name} subtitle="Nation, predictor picks, and match predictions." compact />
      <section className="section">
        <div className="container">
          <FriendDetail profile={profile} />
        </div>
      </section>
    </div>
  );
}
