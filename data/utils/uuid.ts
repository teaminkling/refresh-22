/**
 * Utils related to UUIDs.
 */

import {v5} from "uuid";

/**
 * Derive a UUID5 string given the provided name.
 *
 * @param {string} text the text
 * @returns {string} the UUIDv5 string
 */
export const getUuid5String = (text: string): string => {
  // This is an arbitrary UUID used as the namespace.

  return v5(text, "1b671a64-40d5-491e-99b0-da01ff1f3341");
};
