import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div
      className={styles.routeLoading}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading page"
    >
      <p className={styles.status}>
        <span className="sr-only">Loading page</span>
      </p>
    </div>
  );
}
