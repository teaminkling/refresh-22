/**
 * Utils for dealing with Auth0.
 */

import {EDITORS} from "../constants/kv";

/**
 * Non-contextually determine if the given identifier represents a staff user.
 *
 * Note that to determine if the caller is the author of requested content, a more specific
 * contextual check must be made.
 *
 * @param {string} identifier the user's ID
 * @param {KVNamespace} authKv the auth KV store
 * @returns {boolean} whether the identifier provided is a staff member
 */
export const validateIsStaff = async (
  identifier: string, authKv: KVNamespace
): Promise<boolean> => {
  const editorsMap: Record<string, string[]> = JSON.parse(await authKv.get(EDITORS) || "{}");
  const editors: string[] = editorsMap["editors"] || [];

  if (editors.length === 0) {
    console.warn("There are no editors in the database. Consider adding one.");
  }

  return editors.includes(identifier);
};
