import Artist from "../core/Artist";
import Week from "../core/Week";

/**
 * Meta-information that is infrequently retrieved from the backend.
 *
 * This information is used for aggregate pages. New artists and new weeks will not appear
 * unless they are fetched after they appear in the KV store.
 *
 * A force refresh is also required after the "week release" date.
 */
export default interface Meta {
  /**
   * All of the artists with at least one post in this year.
   */
  artists: Artist[];

  /**
   * All of the weeks of this year.
   *
   * For non-staff users, this will return without unpublished weeks.
   */
  weeks: Week[];
}
