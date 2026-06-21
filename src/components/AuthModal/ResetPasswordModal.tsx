"use client";

import { Dialog } from "@khamudom/lumen-ui-react";
import { ResetPasswordForm } from "@/components/ResetPasswordForm/ResetPasswordForm";

interface ResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResetPasswordModal({
  open,
  onOpenChange,
}: ResetPasswordModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      aria-labelledby="reset-password-modal-title"
    >
      <ResetPasswordForm key={String(open)} embedded />
    </Dialog>
  );
}
