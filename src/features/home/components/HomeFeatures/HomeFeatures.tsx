"use client";

import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@khamudom/lumen-ui-react";
import styles from "./HomeFeatures.module.css";

const features = [
  {
    title: "Live Match Center",
    description:
      "Follow every kickoff, score, and match status across the tournament.",
    href: "/matches",
  },
  {
    title: "Prediction Challenge",
    description: "Pick your champion and build your World Cup bracket.",
    href: "/predictor",
  },
  {
    title: "Group Standings",
    description: "Track every group from A through L with live standings.",
    href: "/matches?section=group-standings",
  },
  {
    title: "Stadiums",
    description:
      "Explore World Cup 2026 venues across USA, Mexico, and Canada.",
    href: "/stadiums",
  },
];

export function HomeFeatures() {
  return (
    <div className={styles.featureGrid}>
      {features.map((feature) => {
        const isDeepLink =
          feature.href.includes("#") || feature.href.includes("section=");

        return (
        <Link
          key={feature.title}
          href={feature.href}
          scroll={!isDeepLink}
          className={styles.featureLink}
        >
          <Card className={styles.featureCard} interactive>
            <CardHeader>
              <Badge variant="default" appearance="tint" className={styles.featureBadge}>
                Feature
              </Badge>
              <CardTitle as="h3">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={styles.featureDesc}>{feature.description}</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost">Explore →</Button>
            </CardFooter>
          </Card>
        </Link>
        );
      })}
    </div>
  );
}
