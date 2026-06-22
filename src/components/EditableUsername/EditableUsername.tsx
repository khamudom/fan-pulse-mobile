"use client";

import { useRef, useState, useTransition } from "react";
import { useInvalidateAndRefresh } from "@/hooks/useInvalidateAndRefresh";
import { Button, Dialog, Input } from "@khamudom/lumen-ui-react";
import { setUsername } from "@/actions/social";
import styles from "./EditableUsername.module.css";

interface EditableUsernameProps {
  username: string | null;
}

export function EditableUsername({ username }: EditableUsernameProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(username ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const invalidateAndRefresh = useInvalidateAndRefresh();

  function openModal() {
    setValue(username ?? "");
    setError(null);
    setOpen(true);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await setUsername(value);
      if (result.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
      invalidateAndRefresh();
    });
  }

  return (
    <span className={styles.wrapper}>
      <span className={styles.label}>Username</span>
      <span className={styles.value}>
        {username ? `@${username}` : "Not set"}
      </span>
      <button
        ref={triggerRef}
        type="button"
        className={styles.editButton}
        onClick={openModal}
        aria-label="Edit username"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        heading="Edit username"
        description="Friends can search for you by username."
        returnFocusRef={triggerRef}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Username"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              if (error) setError(null);
            }}
            error={error ?? undefined}
            maxLength={20}
            autoFocus
          />
          <p className={styles.hint}>
            3–20 characters. Letters, numbers, and underscores only.
          </p>
          <div className={styles.actions}>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isPending}>
              Save
            </Button>
          </div>
        </form>
      </Dialog>
    </span>
  );
}
