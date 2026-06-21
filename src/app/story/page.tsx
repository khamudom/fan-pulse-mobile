import Link from "next/link";
import { DataSourceBadge } from "@/components/display/DataSourceBadge";
import { getTodaysStory, formatStoryDate } from "@/lib/todaysStory";
import styles from "./page.module.css";

export const metadata = {
  title: "Today's World Cup Story",
};

export default function StoryPage() {
  const story = getTodaysStory();
  const storyDate = formatStoryDate();

  return (
    <div className="page">
      <article className={styles.article}>
        <div className={`container ${styles.inner}`}>
          <header className={styles.header}>
            <div className={styles.headerTop}>
              <p className={styles.chapter}>
                Chapter {story.chapter} · {storyDate}
              </p>
              <DataSourceBadge source="local" />
            </div>
            <h1 className={styles.title}>{story.headline}</h1>
            <p className={styles.lede}>{story.teaser}</p>
            <p className={styles.hook}>{story.hook}</p>
          </header>

          <div className={styles.prose}>
            {story.fullStory.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <footer className={styles.footer}>
            <p className={styles.closing}>Tomorrow it changes.</p>
            <p className={styles.closingAccent}>Every day is a new chapter.</p>
            <Link href="/#story-today" className={styles.back}>
              Back to today&apos;s story
            </Link>
          </footer>
        </div>
      </article>
    </div>
  );
}
