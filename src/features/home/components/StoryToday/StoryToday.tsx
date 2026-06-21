import Link from "next/link";
import type { WorldCupStory } from "@/data/worldCupStories";
import styles from "./StoryToday.module.css";

interface StoryTodayProps {
  story: WorldCupStory;
}

export function StoryToday({ story }: StoryTodayProps) {
  const dropCap = story.teaser.charAt(0);
  const teaserBody = story.teaser.slice(1);

  return (
    <section
      className={styles.section}
      id="story-today"
      aria-labelledby="story-today-title"
    >
      <div className={styles.inner}>
        <p className={styles.chapterMarker}>Chapter {story.chapter}</p>

        <article className={styles.ticket} aria-labelledby="story-today-title">
          <div className={styles.perforation} aria-hidden="true" />
          <div className={styles.ticketHeader}>
            <span className={styles.ticketLabel}>Today&apos;s Tale</span>
            <span className={styles.ticketStub}>Admit One</span>
          </div>

          <h2 id="story-today-title" className={styles.headline}>
            {story.headline}
          </h2>

          <p className={styles.teaser}>
            <span className={styles.dropCap} aria-hidden="true">
              {dropCap}
            </span>
            <span className="sr-only">{dropCap}</span>
            {teaserBody}
          </p>

          <p className={styles.hook}>{story.hook}</p>

          <Link href="/story" className={styles.cta}>
            Read tonight&apos;s chapter
          </Link>
        </article>

        <footer className={styles.signoff}>
          <p className={styles.signoffLine}>
            <em>Tomorrow, a new page turns.</em>
          </p>
          <p className={styles.signoffAccent}>Every day is a new chapter.</p>
        </footer>
      </div>
    </section>
  );
}
