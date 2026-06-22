"use client";

import { useRef, useState, useTransition } from "react";
import { useInvalidateAndRefresh } from "@/hooks/useInvalidateAndRefresh";
import { Button, Dialog, Input } from "@khamudom/lumen-ui-react";
import { updateDisplayName } from "@/actions/profile";
import styles from "./EditableDisplayName.module.css";

interface EditableDisplayNameProps {
  displayName: string;
}

export function EditableDisplayName({ displayName }: EditableDisplayNameProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(displayName);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const invalidateAndRefresh = useInvalidateAndRefresh();

  function openModal() {
    setValue(displayName);
    setError(null);
    setOpen(true);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Display name can't be empty.");
      return;
    }

    startTransition(async () => {
      const result = await updateDisplayName(trimmed);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
      invalidateAndRefresh();
    });
  }

  return (
    <span className={styles.wrapper}>
      <span>{displayName}</span>
      <button
        ref={triggerRef}
        type="button"
        className={styles.editButton}
        onClick={openModal}
        aria-label="Edit display name"
      >
        <svg
          width="18"
          height="18"
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
        heading="Edit display name"
        description="This is the name other fans will see."
        returnFocusRef={triggerRef}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Display name"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              if (error) setError(null);
            }}
            error={error ?? undefined}
            maxLength={50}
            autoFocus
          />
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
