"use client";

import { Dialog } from "@khamudom/lumen-ui-react";
import type { RefObject } from "react";
import { LoginForm } from "@/components/LoginForm";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: "signin" | "signup";
  pendingCountry?: string;
  nextPath?: string;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

export function AuthModal({
  open,
  onOpenChange,
  initialMode = "signin",
  pendingCountry,
  nextPath,
  returnFocusRef,
}: AuthModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      returnFocusRef={returnFocusRef}
      aria-labelledby="auth-modal-title"
    >
      <LoginForm
        key={`${open}-${initialMode}-${pendingCountry ?? ""}-${nextPath ?? ""}`}
        embedded
        initialMode={initialMode}
        pendingCountry={pendingCountry}
        nextPath={nextPath}
      />
    </Dialog>
  );
}
