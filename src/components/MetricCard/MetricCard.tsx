"use client";

import { Card, CardContent } from "@khamudom/lumen-ui-react";
import type { AnalyticsMetric } from "@/types";
import styles from "./MetricCard.module.css";

interface MetricCardProps {
  metric: AnalyticsMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  return (
    <Card className={styles.card}>
      <CardContent>
        <p className={styles.label}>{metric.label}</p>
        <p className={styles.value}>{metric.value}</p>
        {metric.change && (
          <p
            className={`${styles.change} ${
              metric.trend === "up"
                ? styles.up
                : metric.trend === "down"
                  ? styles.down
                  : ""
            }`}
          >
            {metric.change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
