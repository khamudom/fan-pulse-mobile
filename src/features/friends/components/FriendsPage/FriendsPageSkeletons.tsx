import { LoadingState } from "@/components/feedback/LoadingState";
import experienceStyles from "../FriendsExperience/FriendsExperience.module.css";
import skeletonStyles from "./FriendsPageSkeletons.module.css";

const TAB_LABELS = ["Feed", "Friends", "Requests", "Find"] as const;

export function FriendsActivitySkeleton() {
  return (
    <div className={experienceStyles.grid}>
      <LoadingState label="Loading friends activity…" rows={4} />
    </div>
  );
}

export function FriendsRosterSkeleton() {
  return (
    <div
      className={experienceStyles.experience}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading friends"
    >
      <div className={experienceStyles.tabs} aria-hidden="true">
        {TAB_LABELS.map((label) => (
          <span key={label} className={skeletonStyles.tabPlaceholder}>
            {label}
          </span>
        ))}
      </div>
      <FriendsActivitySkeleton />
    </div>
  );
}
