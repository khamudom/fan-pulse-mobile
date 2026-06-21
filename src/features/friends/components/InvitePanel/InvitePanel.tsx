"use client";

import { useState, useTransition } from "react";
import { Button } from "@khamudom/lumen-ui-react";
import { createInviteLink } from "@/actions/social";
import styles from "./InvitePanel.module.css";

export function InvitePanel() {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    setError(null);
    setCopied(false);
    startTransition(async () => {
      const result = await createInviteLink();
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setUrl(result.url);
    });
  }

  async function handleCopy() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={styles.panel}>
      <p className={styles.hint}>
        Share a link with friends and family. When they open it and sign in,
        you&apos;ll connect automatically.
      </p>
      {error ? <p className={styles.error}>{error}</p> : null}
      {url ? (
        <div className={styles.linkRow}>
          <input
            className={styles.linkInput}
            readOnly
            value={url}
            aria-label="Invite link"
          />
          <Button type="button" variant="outline" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      ) : null}
      <Button
        type="button"
        variant="primary"
        loading={isPending}
        onClick={handleGenerate}
      >
        {url ? "Generate new link" : "Create invite link"}
      </Button>
      {copied ? (
        <p className={styles.success}>Link copied to clipboard.</p>
      ) : null}
    </div>
  );
}
