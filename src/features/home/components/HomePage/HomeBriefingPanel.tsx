import { BriefingSection } from "../BriefingContent";
import { BriefingTimeZoneSync } from "../BriefingContent/BriefingTimeZoneSync";
import { LocalTodayDate } from "@/components/display/LocalTodayDate";
import { EmptyState } from "@/components/feedback/EmptyState";
import styles from "@/app/page.module.css";

type HomeBriefingPanelProps = {
  briefing: { content: string | null; error?: string };
};

export function HomeBriefingPanel({ briefing }: HomeBriefingPanelProps) {
  return (
    <section className={styles.briefingSection} id="briefing">
      <BriefingTimeZoneSync />
      <div className="container">
        <div className={styles.briefingPanel}>
          <div className={styles.briefingHeader}>
            <h2 className={styles.briefingTitle}>
              Morning Briefing for <LocalTodayDate />
            </h2>
            <p className={styles.briefingSubtitle}>
              Your personalized 3-minute read — yesterday&apos;s results,
              today&apos;s storylines, and what matters for your team.
            </p>
          </div>
          {briefing.error ? (
            <EmptyState
              title="Briefing unavailable"
              message={briefing.error}
              actionLabel="Set up My World Cup"
              actionHref="/my-world-cup"
            />
          ) : (
            <BriefingSection initialContent={briefing.content} />
          )}
        </div>
      </div>
    </section>
  );
}
