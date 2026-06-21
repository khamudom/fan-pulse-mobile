/**
 * Data source toggles for development preview.
 *
 * USE_PROTOTYPE_DATA — when false, UI sections with no API (polls, sentiment,
 * AI insights, articles, etc.) are hidden so only live API data is visible.
 */
export const USE_PROTOTYPE_DATA = true;

export const isApiPreviewMode = !USE_PROTOTYPE_DATA;
