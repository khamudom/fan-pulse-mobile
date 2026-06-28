"use client";

import Image from "next/image";
import type { Team } from "@/types";
import styles from "./KnockoutAdvancers.module.css";

interface KnockoutAdvancersProps {
  teams: Team[];
}

function TeamFlag({ flag, name }: { flag?: string; name: string }) {
  if (!flag) {
    return <span className={styles.flagPlaceholder} aria-hidden="true" />;
  }

  return (
    <Image
      src={flag}
      alt=""
      width={20}
      height={14}
      className={styles.flag}
    />
  );
}

export function KnockoutAdvancers({ teams }: KnockoutAdvancersProps) {
  if (teams.length === 0) return null;

  return (
    <section className={styles.wrapper} aria-label="Round of 32 teams">
      <div className={styles.header}>
        <h3 className={styles.title}>Round of 32</h3>
        <span className={styles.count}>{teams.length} teams</span>
      </div>
      <div className={styles.grid}>
        {teams.map((team) => (
          <div key={team.id} className={styles.teamCard}>
            <TeamFlag flag={team.flag} name={team.name} />
            <span className={styles.teamName}>{team.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
