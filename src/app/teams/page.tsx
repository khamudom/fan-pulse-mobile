import { Suspense } from "react";
import { TeamsPageContent } from "@/features/teams/components/TeamsPageContent/TeamsPageContent";
import { TeamsPageSkeleton } from "@/features/teams/components/TeamsPageSkeleton/TeamsPageSkeleton";

export const metadata = {
  title: "Teams",
  description: "Explore all 48 nations competing at FIFA World Cup 2026.",
};

export default function TeamsPage() {
  return (
    <div className="page">
      <Suspense fallback={<TeamsPageSkeleton />}>
        <TeamsPageContent />
      </Suspense>
    </div>
  );
}
