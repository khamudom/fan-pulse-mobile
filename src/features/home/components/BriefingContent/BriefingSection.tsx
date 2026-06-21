"use client";

import { useState } from "react";
import { Button } from "@khamudom/lumen-ui-react";
import { getOrCreateDailyBriefing } from "@/actions/briefing";
import { BriefingContent } from "./BriefingContent";
import styles from "./BriefingContent.module.css";

interface BriefingSectionProps {
  initialContent: string | null;
}

export function BriefingSection({ initialContent }: BriefingSectionProps) {
  const [content, setContent] = useState<string | null>(initialContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getOrCreateDailyBriefing();
      if (result.error) {
        setError(result.error);
      } else {
        setContent(result.content);
      }
    } catch {
      setError("Could not generate your briefing. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (content) {
    return <BriefingContent content={content} />;
  }

  return (
    <div className={styles.prompt}>
      <p className={styles.promptText}>
        Your personalized briefing for today isn&apos;t ready yet. Generate it
        to get yesterday&apos;s results, today&apos;s storylines, and what
        matters for your team.
      </p>
      <Button
        type="button"
        variant="primary"
        onClick={() => void generate()}
        disabled={loading}
      >
        {loading ? "Generating…" : "Write today's edition"}
      </Button>
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
