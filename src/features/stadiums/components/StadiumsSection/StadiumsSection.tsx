import { SectionHeader } from "@/components/display/SectionHeader";
import { StadiumCard } from "@/components/StadiumCard";
import { DataSourceBadge } from "@/components/display/DataSourceBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { getMatches, getStadiums } from "@/services/worldCupApi";
import type { Match } from "@/types";
import pageStyles from "@/app/stadiums/page.module.css";

function groupMatchesByStadium(matches: Match[]): Map<string, Match[]> {
  const byStadium = new Map<string, Match[]>();

  for (const match of matches) {
    if (!match.stadiumId) continue;
    const list = byStadium.get(match.stadiumId) ?? [];
    list.push(match);
    byStadium.set(match.stadiumId, list);
  }

  return byStadium;
}

export async function StadiumsSection() {
  const [{ data: stadiums, error: stadiumsError }, { data: matches }] =
    await Promise.all([getStadiums(), getMatches()]);
  const matchesByStadium = groupMatchesByStadium(matches);

  if (stadiums.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <SectionHeader
            title="All Stadiums"
            action={<DataSourceBadge source="unavailable" />}
          />
          <EmptyState
            title="No stadiums available"
            message={
              stadiumsError ??
              "The World Cup API returned no stadium data."
            }
          />
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          title="All Stadiums"
          subtitle={`${stadiums.length} venues`}
          action={<DataSourceBadge source="api" />}
        />
        <div className={pageStyles.grid}>
          {stadiums.map((stadium) => (
            <StadiumCard
              key={stadium.id}
              stadium={stadium}
              matches={matchesByStadium.get(stadium.id) ?? []}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
