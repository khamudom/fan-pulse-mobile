"use client";

import { useRef, type ReactNode } from "react";
import { useEdgeSwipeBack } from "@/hooks/useSwipeNavigation";

interface DetailSwipeBackProps {
  children: ReactNode;
}

export function DetailSwipeBack({ children }: DetailSwipeBackProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEdgeSwipeBack(ref);
  return <div ref={ref}>{children}</div>;
}
