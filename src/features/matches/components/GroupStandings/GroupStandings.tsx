"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@khamudom/lumen-ui-react";
import type { Group } from "@/types";
import styles from "./GroupStandings.module.css";

interface GroupStandingsProps {
  groups: Group[];
  limit?: number;
}

export function GroupStandings({ groups, limit }: GroupStandingsProps) {
  const displayGroups = limit ? groups.slice(0, limit) : groups;

  if (displayGroups.length === 0) {
    return null;
  }

  return (
    <div className={styles.grid}>
      {displayGroups.map((group) => (
        <Card key={group.name}>
          <CardHeader>
            <CardTitle as="h3">Group {group.name}</CardTitle>
          </CardHeader>
          <CardContent className={styles.tableWrap}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={styles.teamCol}>Team</TableHead>
                  <TableHead className={styles.statCol}>P</TableHead>
                  <TableHead className={styles.statCol}>W</TableHead>
                  <TableHead className={styles.statCol}>D</TableHead>
                  <TableHead className={styles.statCol}>L</TableHead>
                  <TableHead className={styles.gdCol}>GD</TableHead>
                  <TableHead className={styles.ptsCol}>Pt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.standings.map((row, idx) => (
                  <TableRow key={row.teamId}>
                    <TableCell className={styles.teamCol}>
                      <span className={styles.teamCell}>
                        {row.flag && (
                          <img src={row.flag} alt="" width={16} height={11} />
                        )}
                        <span className={styles.teamName}>
                          <span className={styles.rank}>{idx + 1}.</span>{" "}
                          {row.teamName}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className={styles.statCol}>{row.played}</TableCell>
                    <TableCell className={styles.statCol}>{row.won}</TableCell>
                    <TableCell className={styles.statCol}>{row.drawn}</TableCell>
                    <TableCell className={styles.statCol}>{row.lost}</TableCell>
                    <TableCell className={styles.gdCol}>
                      {row.goalDifference}
                    </TableCell>
                    <TableCell className={styles.ptsCol}>
                      <strong>{row.points}</strong>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
