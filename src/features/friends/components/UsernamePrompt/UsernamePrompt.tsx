"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from "@khamudom/lumen-ui-react";
import { setUsername } from "@/actions/social";
import styles from "./UsernamePrompt.module.css";

export function UsernamePrompt() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await setUsername(value);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className={styles.prompt}>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle as="h2">Choose a username</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={styles.hint}>
            Pick a username so friends can find you on Fan Pulse. Letters,
            numbers, and underscores only.
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Username"
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                if (error) setError(null);
              }}
              placeholder="footiefan42"
              maxLength={20}
              autoFocus
              error={error ?? undefined}
            />
            <Button type="submit" variant="primary" loading={isPending}>
              Save username
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
