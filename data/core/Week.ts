import {KeysEnum} from "../utils/typescript";

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

/**
 * The keys of {@link Week}.
 */
export const WeekKeys: KeysEnum<Week> = {
  year: true,
  week: true,
  theme: true,
  information: true,
  isPublished: true,
};
