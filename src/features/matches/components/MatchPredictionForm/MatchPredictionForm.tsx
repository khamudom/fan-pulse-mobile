"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  Input,
  Button,
} from "@khamudom/lumen-ui-react";
import type { Match } from "@/types";
import { savePrediction } from "@/actions/points";
import styles from "./MatchPredictionForm.module.css";

interface MatchPredictionFormProps {
  match: Match;
  isSignedIn?: boolean;
  initialPrediction?: { home: number; away: number } | null;
}

type Outcome = "home" | "away" | "draw";

function getOutcome(home: number, away: number): Outcome {
  if (home > away) return "home";
  if (away > home) return "away";
  return "draw";
}

function deriveWinnerLabel(home: number, away: number, match: Match): string {
  const outcome = getOutcome(home, away);
  if (outcome === "home") return match.homeTeam.name;
  if (outcome === "away") return match.awayTeam.name;
  return "Draw";
}

export function MatchPredictionForm({
  match,
  isSignedIn = false,
  initialPrediction = null,
}: MatchPredictionFormProps) {
  const [saved, setSaved] = useState(initialPrediction);
  const [winner, setWinner] = useState(
    initialPrediction
      ? deriveWinnerLabel(initialPrediction.home, initialPrediction.away, match)
      : "",
  );
  const [homeScore, setHomeScore] = useState(
    initialPrediction ? String(initialPrediction.home) : "",
  );
  const [awayScore, setAwayScore] = useState(
    initialPrediction ? String(initialPrediction.away) : "",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const teams = [match.homeTeam.name, match.awayTeam.name, "Draw"];

  const hasResult =
    match.status === "live" ||
    match.status === "halftime" ||
    match.status === "finished";
  const isFinal = match.status === "finished";
  const isLocked =
    match.status === "halftime" || match.status === "finished";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!winner || isLocked) return;

    const home = homeScore !== "" ? parseInt(homeScore, 10) : 0;
    const away = awayScore !== "" ? parseInt(awayScore, 10) : 0;

    setLoading(true);
    setMessage(null);
    const result = await savePrediction(match.id, home, away);
    setLoading(false);

    if ("error" in result && result.error) {
      setMessage(result.error);
      return;
    }

    setSaved({ home, away });
    setMessage(
      result.isNew ? "Prediction saved · +25 points!" : "Prediction updated.",
    );
  };

  if (!isSignedIn) {
    return (
      <Card>
        <CardHeader>
          <CardTitle as="h2">Match Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={styles.signInPrompt}>
            <Link href="/login">Sign in</Link> to predict the score, track your
            accuracy, and earn points.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Match Prediction</CardTitle>
      </CardHeader>
      <CardContent className={styles.content}>
        {saved ? (
          <PredictionSummary saved={saved} match={match} hasResult={hasResult} isFinal={isFinal} />
        ) : null}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <Select
              label="Winner"
              value={winner}
              onChange={(e) => setWinner(e.target.value)}
              options={[
                { value: "", label: "Select winner" },
                ...teams.map((t) => ({ value: t, label: t })),
              ]}
              required
            />
          </div>
          <div className={styles.scoreRow}>
            <Input
              label={`${match.homeTeam.name} score`}
              type="number"
              min={0}
              max={20}
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
            />
            <Input
              label={`${match.awayTeam.name} score`}
              type="number"
              min={0}
              max={20}
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading || isLocked}>
            {loading
              ? "Saving…"
              : saved
                ? "Update Prediction"
                : "Submit Prediction"}
          </Button>
          {isLocked ? (
            <p className={styles.locked} role="status">
              {isFinal
                ? "This match has finished — predictions are closed."
                : "Predictions are closed once the match reaches half time."}
            </p>
          ) : null}
          {message ? (
            <p className={styles.success} role="status">
              {message}
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}

function PredictionSummary({
  saved,
  match,
  hasResult,
  isFinal,
}: {
  saved: { home: number; away: number };
  match: Match;
  hasResult: boolean;
  isFinal: boolean;
}) {
  const verdict = hasResult ? getVerdict(saved, match) : null;

  return (
    <div className={styles.summary}>
      <div className={styles.summaryRow}>
        <span className={styles.summaryLabel}>Your prediction</span>
        <span className={styles.summaryScore}>
          {match.homeTeam.name} {saved.home} – {saved.away}{" "}
          {match.awayTeam.name}
        </span>
      </div>
      {verdict ? (
        <p
          className={`${styles.verdict} ${styles[`verdict_${verdict.tone}`]}`}
          role="status"
        >
          {isFinal ? verdict.finalLabel : verdict.liveLabel}
        </p>
      ) : null}
    </div>
  );
}

function getVerdict(
  saved: { home: number; away: number },
  match: Match,
): { tone: "exact" | "result" | "miss"; finalLabel: string; liveLabel: string } {
  const exact =
    saved.home === match.homeScore && saved.away === match.awayScore;
  if (exact) {
    return {
      tone: "exact",
      finalLabel: "Spot on — exact score!",
      liveLabel: "Exact score so far",
    };
  }

  const sameOutcome =
    getOutcome(saved.home, saved.away) ===
    getOutcome(match.homeScore, match.awayScore);
  if (sameOutcome) {
    return {
      tone: "result",
      finalLabel: "Right result, wrong score",
      liveLabel: "Right result so far",
    };
  }

  return {
    tone: "miss",
    finalLabel: "Didn't go your way",
    liveLabel: "Off so far",
  };
}
