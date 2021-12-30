/**
 * Frontend/universal utils related to time.
 */

import moment from "moment-timezone";
import {
  PROMPT_RELEASE_DAY,
  PROMPT_RELEASE_HOUR,
  SHOWCASE_DAY,
  SHOWCASE_HOUR
} from "../data/constants/setup";

/**
 * Return the next day of the week by day index.
 *
 * 0: Sunday
 * 1: Monday
 * 2: Tuesday
 * 3: Wednesday
 * 4: Thursday
 * 5: Friday
 * 6: Saturday
 *
 * Note: this does not change the hour or minutes!
 *
 * @param {number} day the day index
 * @returns {Date} the next day that matches the day index
 */
const getNextDay = (day: number): Date => {
  // Now that the "now" variable is a browser-local timezone at this point. It must be converted
  // to an Australia/Melbourne time first.

  const now: moment.Moment = moment().tz("Australia/Melbourne");

  // Setting the locale to Melbourne sets the start of the week to Monday, not Sunday.
  // Programmatically make up for this across browsers.

  const startOfWeek: moment.Moment = now.startOf("isoWeek");

  startOfWeek.add(day - startOfWeek.days(), "days");

  return now.toDate();
};

/**
 * Note: if it is before Saturday, it will return the next Saturday at 12pm. If it is after 12pm
 * Saturday, it will return instead Sunday 12pm which is when new prompts are expected to release.
 *
 * This is a relatively expensive call and should only be called once per reload and require a
 * refresh to re-call.
 *
 * @returns {string} the date to count down to
 */
export const getDateOfNextEvent = (): Date => {
  const now = moment().tz("Australia/Melbourne");

  let targetDay = SHOWCASE_DAY;
  let targetHours = SHOWCASE_HOUR;

  // This assumes that the showcase is always before the prompt release day.

  if (now.day() === PROMPT_RELEASE_DAY) {
    if (now.hour() < PROMPT_RELEASE_HOUR) {
      targetDay = PROMPT_RELEASE_DAY;
      targetHours = PROMPT_RELEASE_HOUR;
    }
  } else if (now.day() === SHOWCASE_DAY) {
    if (now.hour() >= SHOWCASE_HOUR) {
      targetDay = PROMPT_RELEASE_DAY;
      targetHours = PROMPT_RELEASE_HOUR;
    }
  }

  const nextDay: Date = getNextDay(targetDay);

  nextDay.setHours(targetHours);

  return nextDay;
};

/**
 * @returns {string} the nature of the next event
 */
export const getNatureOfNextEvent = (): string => {
  const now = moment().tz("Australia/Melbourne");

  let nature = "Showcase";
  if (now.day() === PROMPT_RELEASE_DAY) {
    // It's Sunday.

    if (now.hour() < PROMPT_RELEASE_HOUR) {
      nature = "New Prompt";
    }
  } else if (now.day() === SHOWCASE_DAY) {
    // It's Saturday.

    if (now.hour() >= SHOWCASE_HOUR) {
      nature = "New Prompt";
    }
  }

  return nature;
};
