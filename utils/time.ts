/**
 * Frontend/universal utils related to time.
 */

import moment from "moment-timezone";
import {
  PROMPT_RELEASE_DAY,
  PROMPT_RELEASE_HOUR,
  SHOWCASE_DATE_REPLACERS,
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
const getNextDay = (day: number): moment.Moment => {
  // No matter the timezone, the user only should care about the time/date in Melbourne.

  const now: moment.Moment = moment().tz("Australia/Melbourne");

  if (now.isoWeekday() <= day) {
    return now.isoWeekday(day);
  }

  return now.add(1, "week").isoWeekday(day);
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

  // Make sure that we're not using a custom override for the showcase date.

  let targetDay = SHOWCASE_DAY;
  let targetHour = SHOWCASE_HOUR;

  // This assumes that the showcase is always before the prompt release day.

  if (now.day() === PROMPT_RELEASE_DAY) {
    if (now.hour() < PROMPT_RELEASE_HOUR) {
      targetDay = PROMPT_RELEASE_DAY;
      targetHour = PROMPT_RELEASE_HOUR;
    }
  } else if (now.day() === SHOWCASE_DAY) {
    if (now.hour() >= SHOWCASE_HOUR) {
      targetDay = PROMPT_RELEASE_DAY;
      targetHour = PROMPT_RELEASE_HOUR;
    }
  }

  let nextDay: moment.Moment = getNextDay(targetDay);

  // Normally, we'd be satisfied getting the next day based on the target hours and target day.
  // However, if we specifically replace out this day with another one using a custom map, we
  // would change both the target day and the target hours.

  const isoDate = nextDay.toISOString(true).slice(0, 10);

  const replacement: { day: number; hour: number } | undefined = SHOWCASE_DATE_REPLACERS[isoDate];
  if (replacement) {
    targetDay = replacement.day;
    targetHour = replacement.hour;

    nextDay = getNextDay(targetDay);
  }

  nextDay.hours(targetHour);
  nextDay.minutes(0);
  nextDay.seconds(0);
  nextDay.milliseconds(0);

  return nextDay.toDate();
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
