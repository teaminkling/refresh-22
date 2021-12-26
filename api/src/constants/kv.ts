/**
 * Constants used to access parts of the KV namespace.
 */

// REFRESH KV.

/**
 * A key for a map of works indexed by the artist's name.
 */
export const WORKS_WITH_ARTIST_INDEX = "works/by-artist";

/**
 * A key for a map of works indexed by `year/week`.
 *
 * For example, `works/by-year-week` can be accessed with `2022/1` for week 1 of 2022.
 */
export const WORKS_WITH_WEEK_INDEX = "works/by-year-week";

/**
 * A key for a map of works indexed by ID.
 */
export const WORKS_WITH_ID_INDEX = "works/by-id";

/**
 * A key for the meta-information map.
 */
export const META = "meta";

// AUTH KV.

/**
 * The location to lookup the editor usernames.
 *
 * The format is simply: `{"editors": ["<snip>", "<snip>"]}`
 */
export const EDITORS = "editors";
