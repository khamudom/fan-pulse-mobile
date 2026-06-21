"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Button } from "@khamudom/lumen-ui-react";
import styles from "./Hero.module.css";

interface HeroAction {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "outline";
}

interface HeroProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  tagline?: string;
  stats?: string[];
  actions?: HeroAction[];
  sponsor?: string;
  compact?: boolean;
  centered?: boolean;
  aside?: React.ReactNode;
  asideWide?: boolean;
  children?: React.ReactNode;
  backgroundImage?: string | StaticImageData;
  backgroundImageFit?: "default" | "photo" | "fullWidth";
}

export function Hero({
  title,
  subtitle,
  tagline,
  stats = [],
  actions = [],
  sponsor,
  compact = false,
  centered = false,
  aside,
  asideWide = false,
  children,
  backgroundImage,
  backgroundImageFit = "default",
}: HeroProps) {
  return (
    <section
      className={`${styles.hero} ${compact ? styles.compact : ""} ${centered ? styles.centered : ""} ${backgroundImage ? styles.hasBackground : ""}`}
      aria-labelledby="hero-title"
    >
      {backgroundImage ? (
        <div className={styles.background} aria-hidden="true">
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className={`${styles.backgroundImage} ${
              backgroundImageFit === "photo" ? styles.backgroundImagePhoto : ""
            } ${
              backgroundImageFit === "fullWidth"
                ? styles.backgroundImageFullWidth
                : ""
            }`}
          />
          <div
            className={
              backgroundImageFit === "fullWidth"
                ? styles.backgroundOverlayFullWidth
                : styles.backgroundOverlay
            }
          />
        </div>
      ) : null}
      <div
        className={`${styles.inner} ${backgroundImage ? styles.withBackground : ""} ${
          aside ? styles.withAside : ""
        } ${asideWide ? styles.withWideAside : ""}`}
      >
        <div className={styles.content}>
          {sponsor && (
            <p
              className={styles.sponsor}
              aria-label={`Presented by ${sponsor}`}
            >
              Presented by <strong>{sponsor}</strong>
            </p>
          )}
          <h1 id="hero-title" className={styles.title}>
            {title}
          </h1>
          {stats.length > 0 && (
            <ul className={styles.stats} aria-label="Tournament scale">
              {stats.map((stat) => (
                <li key={stat}>{stat}</li>
              ))}
            </ul>
          )}
          {tagline ? <p className={styles.tagline}>{tagline}</p> : null}
          <p className={styles.subtitle}>{subtitle}</p>
          {actions.length > 0 && (
            <div className={styles.actions}>
              {actions.map((action) => (
                <Link key={action.href} href={action.href}>
                  <Button
                    variant={
                      action.variant === "outline"
                        ? "outline"
                        : action.variant === "secondary"
                          ? "secondary"
                          : "primary"
                    }
                  >
                    {action.label}
                  </Button>
                </Link>
              ))}
            </div>
          )}
          {children}
        </div>
        {aside ? <div className={styles.aside}>{aside}</div> : null}
      </div>
    </section>
  );
}
