/**
 * A week.
 */
export default interface Week {
  /**
   * The year number.
   */
  year: number;

  /**
   * The week number of this year.
   */
  week: number;

  /**
   * The actual timestamp to be parsed as a {@link Date}.
   */
  timestamp: string;

  /**
   * The theme short-name.
   */
  theme: string;

  /**
   * Trusted HTML information.
   */
  information: string;

  /**
   * Whether or not this week can be used to submit.
   */
  isPublished: boolean;
}
