import {User} from "@auth0/auth0-spa-js";
import {EDITORS} from "../data/constants/setup";

/**
 * Determine if the given authenticated user is an editor.
 *
 * @param {User} user the {@link User}
 * @returns {boolean} whether the given user is an editor
 */
export const getIsEditor = (user?: User) => {
  if (user && user.sub) {
    const idParts: string[] = user.sub.split("|") || [];

    if (idParts.length > 0) {
      const id: string = idParts[idParts.length - 1];

      return EDITORS.includes(id);
    }
  }

  return false;
};
