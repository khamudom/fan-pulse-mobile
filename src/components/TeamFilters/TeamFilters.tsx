"use client";

import { useMemo, useState } from "react";
import { Input, Select } from "@khamudom/lumen-ui-react";
import { TeamCard } from "@/components/TeamCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import type { Team } from "@/types";
import styles from "./TeamFilters.module.css";

interface TeamFiltersProps {
  teams: Team[];
  groups: string[];
}

export function TeamFilters({ teams, groups }: TeamFiltersProps) {
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("");

  const filtered = useMemo(() => {
    return teams.filter((t) => {
      const matchesSearch =
        !search || t.name.toLowerCase().includes(search.toLowerCase());
      const matchesGroup = !group || t.group === group;
      return matchesSearch && matchesGroup;
    });
  }, [teams, search, group]);

  return (
    <div>
      <div className={styles.filters}>
        <Input
          label="Search teams"
          placeholder="Team name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="search"
        />
        <Select
          label="Group"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          options={[
            { value: "", label: "All groups" },
            ...groups.map((g) => ({ value: g, label: `Group ${g}` })),
          ]}
        />
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          title="No teams found"
          message="Try a different search or group filter."
        />
      ) : (
        <div className={styles.grid}>
          {filtered.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}
