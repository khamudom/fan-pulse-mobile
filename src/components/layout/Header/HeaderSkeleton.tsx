import Link from "next/link";
import styles from "./Header.module.css";
import skeletonStyles from "./HeaderSkeleton.module.css";

export function HeaderSkeleton() {
  return (
    <header
      className={styles.header}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading navigation"
    >
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link
            href="/"
            className={styles.logo}
            aria-label="World Cup FanPulse home"
          >
            <span className={styles.logoMark} aria-hidden="true">
              ⚽
            </span>
            <span className={styles.logoText}>
              Fan<span className={styles.logoAccent}>Pulse</span>
            </span>
          </Link>
        </div>

        <div className={skeletonStyles.navPlaceholder} aria-hidden="true" />
        <div className={skeletonStyles.userPlaceholder} aria-hidden="true" />
      </div>
    </header>
  );
}
