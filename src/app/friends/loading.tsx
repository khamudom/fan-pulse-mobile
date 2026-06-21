import { Hero } from "@/components/display/Hero";
import { FriendsRosterSkeleton } from "@/features/friends/components/FriendsPage";

export default function Loading() {
  return (
    <div className="page">
      <Hero
        title="Friends"
        subtitle="Connect with fellow fans, compare standings, and see who's backing which nation."
        compact
      />
      <section className="section">
        <div className="container">
          <FriendsRosterSkeleton />
        </div>
      </section>
    </div>
  );
}
