import type { StaticImageData } from "next/image";
import homeHeroImage from "./images/home-hero.webp";

/** Replace `src/assets/images/home-hero.webp`, then rebuild to pick up the new asset. */
export const homeHeroBackground: StaticImageData = homeHeroImage;

/** World Cup trophy in the home hero center column (`public/images/trophy.png`). */
export const homeHeroTrophy = "/images/trophy.png";
