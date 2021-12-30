/**
 * Constants used to access parts of the KV namespace.
 */

// REFRESH KV.

/**
 * A key for a map of works indexed by the artist's name.
 *
 * E.g., `works/by-artist/papapastry` returns a map of work IDs to a single work each.
 */
export const WORKS_WITH_ARTIST_INDEX = "works/by-artist";

/**
 * A key for a map of works indexed by `year/week`.
 *
 * E.g., `works/by-year-week/2022/1` returns a map of work IDs to a single work each.
 */
export const WORKS_WITH_WEEK_INDEX = "works/by-year-week";

/**
 * A key for a map of works indexed by ID.
 *
 * E.g., `works/by-id/ABCDE` returns a single work.
 */
export const WORKS_WITH_ID_INDEX = "works/by-id";

/**
 * A key for all works in a list.
 *
 * This is used entirely for the `getWorks` endpoint to reduce calls when requesting all of the
 * data at once. It is the "main list" conceptually.
 */
export const WORKS_WITHOUT_INDEX = "works/all";

/**
 * A key for the weeks map.
 *
 * Unlike artists, this is always retrieved as an aggregate as it must always be consistent with
 * one author and can be easily consolidated.
 *
 * E.g., `weeks/2022` returns the info for 2022.
 */
export const WEEKS = "weeks";

/**
 * A key for the artists map.
 *
 * E.g., `artists/2022` returns the artists in 2022. `artists/123...890` is for a single artist.
 */
export const ARTISTS = "artists";

// AUTH KV.

/**
 * The key for the editor usernames.
 *
 * The format is simply: `{"editors": ["<snip>", "<snip>"]}`
 */
export const EDITORS = "editors";

/**
 * The key for the Discord webhook used to publish and edit submission messages.
 *
 * This must not end with a slash when retrieved.
 */
export const DISCORD_SUBMISSIONS_WEBHOOK = "discord-submissions-webhook";

/**
 * The key for the Discord webhook used to publish and edit week messages.
 *
 * This must not end with a slash when retrieved.
 */
export const DISCORD_WEEKS_WEBHOOK = "discord-weeks-webhook";
