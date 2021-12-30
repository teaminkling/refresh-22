/**
 * State enums.
 */

/**
 * The filter state of the gallery.
 */
export enum Filter {
  /**
   * Show everything.
   */
  ALL,

  /**
   * Show everything by an artist.
   */
  BY_ARTIST,

  /**
   * Show everything in a week.
   */
  BY_WEEK,
}

/**
 * The sort state of the gallery.
 */
export enum Sort {
  /**
   * Show everything in ascending order.
   */
  ASCENDING,

  /**
   * Show everything in descending order.
   */
  DESCENDING,

  /**
   * Show a page of N random works in the filter.
   */
  RANDOM,
}

/**
 * The source of a request for works.
 */
export enum WorkSource {
  /**
   * The work is directly retrieved.
   */
  DIRECT,

  /**
   * The works of an artist are retrieved at the same time.
   */
  BY_ARTIST,

  /**
   * The works of a week are retrieved at the same time.
   */
  BY_WEEK,

  /**
   * All works are retrieved at the same time.
   */
  SEARCH,
}
