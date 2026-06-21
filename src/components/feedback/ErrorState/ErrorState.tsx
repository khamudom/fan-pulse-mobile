"use client";

import { Alert, AlertDescription, AlertTitle } from "@khamudom/lumen-ui-react";
import styles from "./ErrorState.module.css";

interface ErrorStateProps {
  title?: string;
  message: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
}: ErrorStateProps) {
  return (
    <div className={styles.wrapper} role="alert">
      <Alert variant="destructive">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}
