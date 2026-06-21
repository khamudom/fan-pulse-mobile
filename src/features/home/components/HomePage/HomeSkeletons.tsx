import { LoadingState } from "@/components/feedback/LoadingState";
import styles from "@/app/page.module.css";
import skeletonStyles from "./HomeSkeletons.module.css";

export function BriefingSkeleton() {
  return (
    <section className={styles.briefingSection} aria-hidden="true">
      <div className="container">
        <div className={styles.briefingPanel}>
          <LoadingState label="Loading briefing…" rows={4} />
        </div>
      </div>
    </section>
  );
}

export function FixturesSkeleton() {
  return (
    <section className={styles.fixturesSection} aria-hidden="true">
      <div className="container">
        <div className={skeletonStyles.fixturesHeader}>
          <div className={skeletonStyles.titleBlock} />
          <div className={skeletonStyles.actionsBlock} />
        </div>
        <LoadingState label="Loading fixtures…" rows={3} />
      </div>
    </section>
  );
}

export function PersonalizedHeaderSkeleton() {
  return (
    <div className={skeletonStyles.heroSkeleton} aria-hidden="true">
      <LoadingState label="Loading your dashboard…" rows={2} />
    </div>
  );
}

export function PersonalGridSkeleton() {
  return (
    <section className={styles.personalSection} aria-hidden="true">
      <div className="container">
        <LoadingState label="Loading your journey…" rows={3} />
      </div>
    </section>
  );
}

export function BeginJourneySkeleton() {
  return (
    <section className="section" aria-hidden="true">
      <div className="container">
        <LoadingState label="Loading teams…" rows={2} />
      </div>
    </section>
  );
}

export function HomePageSkeleton() {
  return (
    <div className={`page ${styles.homePage}`}>
      <PersonalizedHeaderSkeleton />
      <BriefingSkeleton />
      <PersonalGridSkeleton />
      <FixturesSkeleton />
    </div>
  );
}

export function MatchesPageSkeleton() {
  return (
    <div className="page">
      <LoadingState label="Loading matches…" rows={5} />
    </div>
  );
}
