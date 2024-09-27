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

  /**
   * If present, the Discord post ID for this week's prompt.
   */
  discordId?: string;

  /**
   * A frontend-set value that indicates if a week needs to be edited.
   *
   * Not stored by the backend. The backend just checks this value and if it's `true`, it will
   * perform the usual API writes and Discord calls.
   */
  isUpdating?: boolean;
}
