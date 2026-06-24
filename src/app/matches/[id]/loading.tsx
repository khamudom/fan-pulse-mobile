import styles from "./loading.module.css";

export default function MatchDetailLoading() {
  return (
    <div className="page" aria-busy="true" aria-live="polite">
      <div className={styles.hero}>
        <div className={`${styles.block} ${styles.matchup}`} />
        <div className={`${styles.block} ${styles.subtitle}`} />
        <div className={styles.badges}>
          <div className={`${styles.block} ${styles.badge}`} />
          <div className={`${styles.block} ${styles.badge}`} />
        </div>
      </div>
      <section className="section sectionAlt">
        <div className="container">
          <div className={`${styles.block} ${styles.sectionTitle}`} />
          <div className={styles.grid}>
            <div className={`${styles.block} ${styles.panel}`} />
            <div className={`${styles.block} ${styles.panel}`} />
          </div>
        </div>
      </section>
    </div>
  );
}
