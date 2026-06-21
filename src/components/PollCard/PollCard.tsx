"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
} from "@khamudom/lumen-ui-react";
import type { Poll } from "@/types";
import styles from "./PollCard.module.css";

interface PollCardProps {
  poll: Poll;
}

export function PollCard({ poll }: PollCardProps) {
  const [voted, setVoted] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h3">{poll.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className={styles.options} role="list">
          {poll.options.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                className={`${styles.option} ${voted === option.id ? styles.selected : ""}`}
                onClick={() => setVoted(option.id)}
                aria-pressed={voted === option.id}
                disabled={!!voted && voted !== option.id}
              >
                <span className={styles.optionLabel}>{option.label}</span>
                <span className={styles.percentage}>{option.percentage}%</span>
              </button>
              <Progress
                value={option.percentage}
                label={`${option.label}: ${option.percentage}%`}
                className={styles.progress}
              />
            </li>
          ))}
        </ul>
        {voted ? (
          <p className={styles.thanks} role="status">
            Thanks for voting! Total votes: {poll.totalVotes.toLocaleString()}
          </p>
        ) : (
          <p className={styles.hint}>Select an option to cast your vote</p>
        )}
      </CardContent>
    </Card>
  );
}
