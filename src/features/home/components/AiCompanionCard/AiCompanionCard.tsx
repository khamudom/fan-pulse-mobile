"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from "@khamudom/lumen-ui-react";
import styles from "./AiCompanionCard.module.css";

interface AiCompanionCardProps {
  title?: string;
  prompts?: string[];
  matchId?: string;
}

export function AiCompanionCard({
  title = "AI World Cup Companion",
  prompts = [],
  matchId,
}: AiCompanionCardProps) {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = async (text: string) => {
    const query = text.trim();
    if (!query) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, matchId }),
      });

      if (res.status === 401) {
        setError("Sign in to use the AI companion.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError("Could not reach the companion. Try again.");
        setLoading(false);
        return;
      }

      const answer = await res.text();
      setResponse(answer);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}>
        <CardTitle as="h3">{title}</CardTitle>
      </CardHeader>
      <CardContent className={styles.content}>
        {prompts.length > 0 ? (
          <div
            className={styles.prompts}
            role="group"
            aria-label="Companion prompts"
          >
            {prompts.map((prompt) => (
              <Button
                key={prompt}
                type="button"
                variant="outline"
                onClick={() => {
                  setMessage(prompt);
                  void ask(prompt);
                }}
                disabled={loading}
              >
                {prompt}
              </Button>
            ))}
          </div>
        ) : null}

        <form
          className={styles.form}
          suppressHydrationWarning
          onSubmit={(e) => {
            e.preventDefault();
            void ask(message);
          }}
        >
          <Input
            label="Ask FanPulse"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's on your mind?"
            autoComplete="off"
            suppressHydrationWarning
          />
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !message.trim()}
            suppressHydrationWarning
          >
            {loading ? "Thinking…" : "Ask"}
          </Button>
        </form>

        {error ? <p className={styles.error}>{error}</p> : null}
        {response ? (
          <div className={styles.response} role="region" aria-live="polite">
            <p className={styles.responseLabel}>FanPulse AI</p>
            <p className={styles.responseText}>{response}</p>
          </div>
        ) : (
          !loading &&
          !error && (
            <p className={styles.hint}>
              Your proactive World Cup companion — grounded in live match data.
            </p>
          )
        )}
      </CardContent>
    </Card>
  );
}
