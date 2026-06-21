"use client";

import { useTransition } from "react";
import { Select } from "@khamudom/lumen-ui-react";
import { setFeaturedStadium } from "@/actions/featuredStadium";
import type { Stadium } from "@/types";
import styles from "./AdminDrawer.module.css";

interface FeaturedStadiumPickerProps {
  stadiums: Stadium[];
  currentId?: string;
  resolvedName?: string;
}

export function FeaturedStadiumPicker({
  stadiums,
  currentId,
  resolvedName,
}: FeaturedStadiumPickerProps) {
  const [pending, startTransition] = useTransition();

  return (
    <div className={styles.picker}>
      <Select
        label="Featured venue"
        value={currentId ?? ""}
        disabled={pending || stadiums.length === 0}
        onChange={(e) => {
          const value = e.target.value;
          startTransition(async () => {
            await setFeaturedStadium(value || null);
          });
        }}
        options={[
          { value: "", label: "Auto (largest capacity)" },
          ...stadiums.map((s) => ({
            value: s.id,
            label: `${s.name} — ${s.city}`,
          })),
        ]}
      />
      {resolvedName && (
        <p className={styles.current}>
          {pending ? "Updating…" : `Currently showing: ${resolvedName}`}
        </p>
      )}
    </div>
  );
}
