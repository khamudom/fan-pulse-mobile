import { AiCompanionCard } from "../AiCompanionCard";
import { FanAccoladesBoard } from "@/components/FanAccoladesBoard";
import { FanJourneyCard } from "../FanJourneyCard";
import type { ApiDataSource } from "@/lib/dataSourceBadge";
import type { FanJourneyResult } from "@/lib/fanJourney";
import type { Profile, UserStats } from "@/types/database";
import styles from "@/app/page.module.css";

type HomePersonalGridProps = {
  journey: FanJourneyResult;
  profile: Profile;
  stats: UserStats | null;
  matchesSource: ApiDataSource;
  dataError?: string;
};

export function HomePersonalGrid({
  journey,
  profile,
  stats,
  matchesSource,
  dataError,
}: HomePersonalGridProps) {
  return (
    <section className={styles.personalSection}>
      <div className="container">
        <div className={styles.personalGrid}>
          <FanJourneyCard
            journey={journey}
            favoriteCountry={profile.favorite_country}
            matchesSource={matchesSource}
            dataError={dataError}
          />
          <FanAccoladesBoard stats={stats} variant="compact" />
          <AiCompanionCard title="Your World Cup companion" />
        </div>
      </div>
    </section>
  );
}
