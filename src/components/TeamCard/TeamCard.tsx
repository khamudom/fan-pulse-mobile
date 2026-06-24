"use client";

import {
  Badge,
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@khamudom/lumen-ui-react";
import { getTeamFifaNewsUrl } from "@/lib/fifa";
import type { Team } from "@/types";
import styles from "./TeamCard.module.css";

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  const fifaUrl = getTeamFifaNewsUrl(team);

  return (
    <Card className={styles.card}>
      {team.group && (
        <Badge variant="default" appearance="outline" className={styles.groupBadge}>
          Group {team.group}
        </Badge>
      )}
      <CardHeader className={styles.header}>
        {team.flag ? (
          <img
            src={team.flag}
            alt=""
            className={styles.flag}
            width={48}
            height={36}
          />
        ) : (
          <span className={styles.flagPlaceholder} aria-hidden="true" />
        )}
        <div className={styles.identity}>
          <CardTitle as="h3">{team.name}</CardTitle>
        </div>
      </CardHeader>
      <CardFooter className={styles.footer}>
        <Button
          type="button"
          variant="primary"
          fullWidth
          className={styles.ctaButton}
          aria-label={`View ${team.name} on FIFA.com (opens in new tab)`}
          onClick={() => {
            window.open(fifaUrl, "_blank", "noopener,noreferrer");
          }}
        >
          View Team
        </Button>
      </CardFooter>
    </Card>
  );
}
