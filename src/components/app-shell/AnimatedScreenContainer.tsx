"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";
import { getRouteClass } from "@/config/navigation";
import { useAppStore } from "@/stores/appStore";
import styles from "./AnimatedScreenContainer.module.css";

gsap.registerPlugin(useGSAP);

interface AnimatedScreenContainerProps {
  children: ReactNode;
}

export function AnimatedScreenContainer({ children }: AnimatedScreenContainerProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useAppStore((s) => s.preferences.reducedMotion);
  const prevPathRef = useRef(pathname);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el || reducedMotion) return;

      const transitionDirection = useAppStore.getState().transitionDirection;
      const routeClass = getRouteClass(pathname);
      const prevRouteClass = getRouteClass(prevPathRef.current);
      const isDetailPush =
        routeClass === "detail" && transitionDirection === "forward";
      const isDetailPop =
        prevRouteClass === "detail" && transitionDirection === "back";
      const isTabSwitch =
        routeClass === "tab" && prevRouteClass === "tab" && pathname !== prevPathRef.current;

      gsap.killTweensOf(el);

      const clearMotionProps = () => {
        gsap.set(el, { clearProps: "transform,opacity" });
      };

      if (isDetailPush) {
        gsap.fromTo(
          el,
          { x: "100%", opacity: 0.6 },
          {
            x: "0%",
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
            onComplete: clearMotionProps,
          },
        );
      } else if (isDetailPop) {
        gsap.fromTo(
          el,
          { x: "-12%", opacity: 0.6 },
          {
            x: "0%",
            opacity: 1,
            duration: 0.25,
            ease: "power2.out",
            onComplete: clearMotionProps,
          },
        );
      } else if (isTabSwitch) {
        gsap.fromTo(
          el,
          { opacity: 0.85, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.2,
            ease: "power1.out",
            onComplete: clearMotionProps,
          },
        );
      } else {
        clearMotionProps();
      }

      prevPathRef.current = pathname;
      useAppStore.getState().setTransitionDirection("none");
    },
    { dependencies: [pathname, reducedMotion], scope: containerRef },
  );

  return (
    <div ref={containerRef} className={styles.container}>
      {children}
    </div>
  );
}
