import type { ComponentProps } from "react";
import type { Badge } from "@khamudom/lumen-ui-react";
import type { MatchStatus } from "@/types";

type BadgeStyle = Pick<ComponentProps<typeof Badge>, "variant" | "appearance">;

export function getStatusLabel(status: MatchStatus): string {
  const labels: Record<MatchStatus, string> = {
    scheduled: "Scheduled",
    notstarted: "Not Started",
    live: "Live",
    finished: "Full Time",
    halftime: "Half Time",
    postponed: "Postponed",
  };
  return labels[status] ?? status;
}

export function getStatusBadgeStyle(status: MatchStatus): BadgeStyle {
  switch (status) {
    case "live":
      return { variant: "danger" };
    case "finished":
      return { variant: "default", appearance: "tint" };
    case "halftime":
      return { variant: "warning" };
    default:
      return { variant: "default", appearance: "tint" };
  }
}
