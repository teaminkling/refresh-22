import {User} from "@auth0/auth0-spa-js";
import {EDITORS} from "../data/constants/setup";

/**
 * Determine if the given authenticated user is an editor.
 *
 * @param {User} user the {@link User}
 * @returns {boolean} whether the given user is an editor
 */
export const getIsEditor = (user?: User) => {
  if (user) {
    const id: string | undefined = getUserId(user);

    if (id) {
      return EDITORS.includes(id);
    }
  }

  return false;
};

/**
 * From an Auth0 user, return an ID that is used in the system.
 *
 * @param {User} user the user
 * @returns {string | undefined} the ID, if found
 */
export const getUserId = (user: User): string | undefined => {
  const idParts: string[] = user.sub?.split("|") || [];
  if (idParts.length > 0) {
    return idParts[idParts.length - 1];
  }
};
