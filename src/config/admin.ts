/**
 * Admin / editorial controls — development only.
 *
 * ADMIN_MODE is true only when NODE_ENV === "development". Admin UI and
 * server actions are disabled in production builds.
 *
 * FEATURED_STADIUM_ID — optional static default when no admin pick is saved
 * in the browser cookie (e.g. an API stadium id).
 */
export const ADMIN_MODE = process.env.NODE_ENV === "development";

export const FEATURED_STADIUM_ID: string | undefined = undefined;
