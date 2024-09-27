/**
 * Constants related to setup of the system.
 */

/**
 * The active year.
 */
export const ACTIVE_YEAR = 2022;

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
 *
 * The timezone is Melbourne time.
 */
export const SHOWCASE_HOUR = 12;

/**
 * When the showcase date matches these, replace them with the value.
 *
 * "5" means "Friday". The timezone is Melbourne time.
 */
export const SHOWCASE_DATE_REPLACERS: Record<string, { day: number; hour: number }> = {
  "2022-03-05": {
    day: 5, hour: 19,
  },
};

/**
 * The editors.
 *
 * These are public-facing IDs and do not need to be private. Unless an attacker got control of
 * the entire source code publishing and deployment controls, access control of API endpoints is
 * safe from any users.
 */
export const EDITORS: string[] = [
  "212546139029766144", "453857853367910403",
];

/**
 * The default image used in social/meta shares.
 */
export const DEFAULT_IMAGE = "/logo/temp_social.png";
