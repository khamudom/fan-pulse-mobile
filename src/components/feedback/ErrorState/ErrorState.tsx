"use client";

import { Alert, AlertDescription, AlertTitle, Button } from "@khamudom/lumen-ui-react";
import styles from "./ErrorState.module.css";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className={styles.wrapper} role="alert">
      <Alert variant="destructive">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      {onRetry ? (
        <Button type="button" variant="outline" onClick={onRetry} className={styles.retry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
