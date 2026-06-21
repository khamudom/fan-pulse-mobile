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
                  <TableHead>Team</TableHead>
                  <TableHead>P</TableHead>
                  <TableHead>W</TableHead>
                  <TableHead>D</TableHead>
                  <TableHead>L</TableHead>
                  <TableHead>GD</TableHead>
                  <TableHead>Pts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.standings.map((row, idx) => (
                  <TableRow key={row.teamId}>
                    <TableCell>
                      <span className={styles.teamCell}>
                        {row.flag && (
                          <img src={row.flag} alt="" width={20} height={14} />
                        )}
                        <span>
                          {idx + 1}. {row.teamName}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell>{row.played}</TableCell>
                    <TableCell>{row.won}</TableCell>
                    <TableCell>{row.drawn}</TableCell>
                    <TableCell>{row.lost}</TableCell>
                    <TableCell>{row.goalDifference}</TableCell>
                    <TableCell>
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
