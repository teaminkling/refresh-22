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
