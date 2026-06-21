"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Select,
  Button,
} from "@khamudom/lumen-ui-react";
import {
  championOptions,
  goldenBootOptions,
  surpriseTeamOptions,
} from "@/data/mockPredictions";
import styles from "./PredictionCard.module.css";

export function PredictionCard() {
  const [champion, setChampion] = useState("");
  const [goldenBoot, setGoldenBoot] = useState("");
  const [surprise, setSurprise] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (champion) setSaved(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h3">Prediction Challenge</CardTitle>
      </CardHeader>
      <CardContent className={styles.content}>
        <div className={styles.field}>
          <Label htmlFor="champion-select">Champion</Label>
          <Select
            id="champion-select"
            value={champion}
            onChange={(e) => setChampion(e.target.value)}
            options={[
              { value: "", label: "Select champion" },
              ...championOptions.map((t) => ({ value: t, label: t })),
            ]}
          />
        </div>
        <div className={styles.field}>
          <Label htmlFor="golden-boot-select">Golden Boot winner</Label>
          <Select
            id="golden-boot-select"
            value={goldenBoot}
            onChange={(e) => setGoldenBoot(e.target.value)}
            options={[
              { value: "", label: "Select player" },
              ...goldenBootOptions.map((p) => ({ value: p, label: p })),
            ]}
          />
        </div>
        <div className={styles.field}>
          <Label htmlFor="surprise-select">Biggest surprise team</Label>
          <Select
            id="surprise-select"
            value={surprise}
            onChange={(e) => setSurprise(e.target.value)}
            options={[
              { value: "", label: "Select team" },
              ...surpriseTeamOptions.map((t) => ({ value: t, label: t })),
            ]}
          />
        </div>
        <Button onClick={handleSave} disabled={!champion}>
          Save Predictions
        </Button>
        {saved && (
          <p className={styles.saved} role="status">
            Your predictions have been saved locally for this session.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
