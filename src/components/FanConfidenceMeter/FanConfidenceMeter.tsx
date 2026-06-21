"use client";

import { Card, CardContent, CardHeader, CardTitle, Progress } from "@khamudom/lumen-ui-react";
import styles from "./FanConfidenceMeter.module.css";

interface ConfidenceItem {
  team: string;
  confidence: number;
}

interface FanConfidenceMeterProps {
  title?: string;
  items: ConfidenceItem[];
}

export function FanConfidenceMeter({
  title = "Fan Confidence Meter",
  items,
}: FanConfidenceMeterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle as="h3">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.team} className={styles.item}>
              <div className={styles.row}>
                <span className={styles.team}>{item.team}</span>
                <span className={styles.value}>{item.confidence}%</span>
              </div>
              <Progress
                value={item.confidence}
                label={`${item.team} fan confidence ${item.confidence} percent`}
              />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
