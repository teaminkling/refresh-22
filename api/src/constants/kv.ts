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
 * This is used entirely for the `getWorks` endpoint to reduce calls when requesting all the
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
