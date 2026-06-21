import type { TimelineEvent } from "@/types";
import styles from "./Timeline.module.css";

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <ol className={styles.timeline} aria-label="Tournament timeline">
      {events.map((event, index) => (
        <li
          key={event.id}
          className={`${styles.item} ${styles[event.status]}`}
        >
          <div className={styles.marker} aria-hidden="true">
            {index + 1}
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>{event.title}</h3>
            <time className={styles.date} dateTime={event.date}>
              {event.date}
            </time>
            <p className={styles.description}>{event.description}</p>
            <span className={`${styles.status} ${styles[`status_${event.status}`]}`}>
              {event.status === "completed"
                ? "Completed"
                : event.status === "current"
                  ? "In progress"
                  : "Upcoming"}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
