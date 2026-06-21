"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthModal } from "./AuthModalProvider";

interface LoginPageOpenerProps {
  country?: string;
  nextPath?: string;
}

export function LoginPageOpener({ country, nextPath }: LoginPageOpenerProps) {
  const router = useRouter();
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    openAuthModal({ pendingCountry: country, nextPath });
    router.replace(nextPath ?? "/");
  }, [country, nextPath, openAuthModal, router]);

  return null;
}
