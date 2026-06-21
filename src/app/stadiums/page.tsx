import { Suspense } from "react";
import { Hero } from "@/components/display/Hero";
import { StadiumsSection } from "@/features/stadiums/components/StadiumsSection/StadiumsSection";
import { StadiumsSectionSkeleton } from "@/features/stadiums/components/StadiumsSectionSkeleton/StadiumsSectionSkeleton";

export const metadata = {
  title: "Stadiums",
};

export default function StadiumsPage() {
  return (
    <div className="page">
      <Hero
        title="Host Stadiums"
        subtitle="Explore World Cup 2026 venues across USA, Mexico, and Canada."
        compact
      />

      <Suspense fallback={<StadiumsSectionSkeleton />}>
        <StadiumsSection />
      </Suspense>
    </div>
  );
}
