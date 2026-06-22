"use client";

import { useRouter } from "next/navigation";
import { useInvalidateAndRefresh } from "@/hooks/useInvalidateAndRefresh";
import { useActionState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from "@khamudom/lumen-ui-react";
import { useAuthModal } from "@/components/AuthModal";
import { updatePassword, type AuthActionState } from "@/actions/auth";
import styles from "../LoginForm/LoginForm.module.css";

const initialState: AuthActionState = {};

interface ResetPasswordFormProps {
  embedded?: boolean;
}

export function ResetPasswordForm({
  embedded = false,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const invalidateAndRefresh = useInvalidateAndRefresh();
  const { closeResetPasswordModal } = useAuthModal();
  const [state, action, pending] = useActionState(updatePassword, initialState);

  useEffect(() => {
    if (!state.success) return;

    if (embedded) {
      closeResetPasswordModal();
    }

    router.replace("/");
    invalidateAndRefresh();
  }, [state.success, embedded, closeResetPasswordModal, router, invalidateAndRefresh]);

  const header = (
    <div className={styles.header}>
      <CardTitle
        as="h2"
        id={embedded ? "reset-password-modal-title" : undefined}
      >
        Set a new password
      </CardTitle>
    </div>
  );

  const form = (
    <form action={action} className={styles.form}>
      <Input
        label="New password"
        name="password"
        type="password"
        required
        placeholder="At least 8 characters"
      />
      <Input
        label="Confirm password"
        name="confirmPassword"
        type="password"
        required
        placeholder="Re-enter your password"
      />
      {state.error ? <p className={styles.error}>{state.error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Please wait…" : "Update password"}
      </Button>
    </form>
  );

  if (embedded) {
    return (
      <div className={styles.embedded}>
        {header}
        {form}
      </div>
    );
  }

  return (
    <Card className={styles.card}>
      <CardHeader>{header}</CardHeader>
      <CardContent>{form}</CardContent>
    </Card>
  );
}
