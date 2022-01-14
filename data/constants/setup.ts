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
  "212546139029766144", "453857853367910403",
];

/**
 * The number of seconds to allow unbound uploads using a single URL.
 *
 * At the slowest possible 160 KiB/s, the upload size per file is 48 MiB which is much larger
 * than the 16 MiB limit each.
 */
export const UPLOAD_EXPIRY = 5 * 60;

/**
 * The bytes limit of any one uploaded file.
 *
 * This is 32 MiB.
 */
export const MAXIMUM_CONTENT_LENGTH = 32 * 1024 * 1024;

/**
 * The maximum amount of files per post.
 */
export const MAXIMUM_FILES_PER_WORK = 8;

/**
 * The default image used in social/meta shares.
 */
export const DEFAULT_IMAGE = "/logo/temp_social.png";

/**
 * The default description used in social/meta shares.
 */
export const DEFAULT_DESCRIPTION = (
  "The 2022 Design Refresh is a weekly design/art/creative challenge hosted on Twitch by " +
  "CindryTuna AKA FiveClawD, sponsored by Inkling Interactive."
);
