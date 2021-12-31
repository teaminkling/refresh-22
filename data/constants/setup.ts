/**
 * Constants related to setup of the system.
 */

/**
 * The active year.
 */
export const ACTIVE_YEAR = 2022;

/**
 * The last active week number.
 */
export const LAST_ACTIVE_WEEK = 16;

/**
 * The prompt release day as a number.
 *
 * "0" means "Sunday".
 */
export const PROMPT_RELEASE_DAY = 0;

/**
 * The hour that a prompt is released.
 */
export const PROMPT_RELEASE_HOUR = 12;

/**
 * The showcase day as a number.
 *
 * "6" means "Saturday".
 */
export const SHOWCASE_DAY = 6;

/**
 * The hour that a showcase happens.
 */
export const SHOWCASE_HOUR = 12;

/**
 * The decimal integer colour number for the app's highlight.
 */
export const APP_COLOR = 8158432;

/**
 * The editors.
 *
 * These are public-facing IDs and do not need to be private. Unless an attacker got control of
 * the entire source code publishing and deployment controls, access control of API endpoints is
 * safe from any users.
 */
export const EDITORS: string[] = [
  "212546139029766144",
  "453857853367910403",
];
