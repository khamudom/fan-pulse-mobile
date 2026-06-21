"use client";

import { useEffect, useRef } from "react";
import { formatTimelineDay } from "@/lib/matchDate";
import styles from "./MatchDateTimeline.module.css";

interface MatchDateTimelineProps {
  dates: string[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={direction === "left" ? "M10 12L6 8L10 4" : "M6 4L10 8L6 12"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MatchDateTimeline({
  dates,
  selectedDate,
  onSelectDate,
}: MatchDateTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    const selected = selectedRef.current;
    if (!container || !selected) return;

    const targetLeft =
      selected.offsetLeft - (container.clientWidth - selected.offsetWidth) / 2;
    container.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth",
    });
  }, [selectedDate]);

  if (dates.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -240 : 240,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.navButton}
        aria-label="Scroll dates left"
        onClick={() => scroll("left")}
      >
        <ChevronIcon direction="left" />
      </button>

      <div
        ref={scrollRef}
        className={styles.scroll}
        role="tablist"
        aria-label="Match dates"
      >
        {dates.map((date) => {
          const { weekday, label } = formatTimelineDay(date);
          const isSelected = date === selectedDate;

          return (
            <button
              key={date}
              ref={isSelected ? selectedRef : undefined}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`${styles.dateButton} ${isSelected ? styles.selected : ""}`}
              onClick={() => onSelectDate(date)}
            >
              <span className={styles.weekday}>{weekday}</span>
              <span className={styles.label}>{label}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className={styles.navButton}
        aria-label="Scroll dates right"
        onClick={() => scroll("right")}
      >
        <ChevronIcon direction="right" />
      </button>
    </div>
  );
}
