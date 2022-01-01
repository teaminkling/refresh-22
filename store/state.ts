/**
 * The actual state objects used in the Redux store.
 */

import Artist from "../data/core/Artist";
import Week from "../data/core/Week";
import Work from "../data/core/Work";
import {Filter, Sort} from "./enums";

/**
 * The default root state interface.
 *
 * This is exclusively used to type the reducer combiner.
 */
export interface RootState {
  artistsData: ArtistsState;
  weeksData: WeeksState;
  worksData: WorksState;
}

/**
 * The state related to the gallery interface.
 *
 * Note that we do not remember pagination. Pagination changes the URL so users can directly
 * link to pages as long as the sort isn't random!
 */
export interface GalleryState {
  /**
   * The filter to use to overwrite the URL query string.
   */
  galleryLastFilter: Filter;

  /**
   * The sort to use to overwrite the URL query string.
   */
  galleryLastSort: Sort;
}

/**
 * The state related to week information.
 */
export interface WeeksState {
  /**
   * A map of week number (as a string) to week objects.
   */
  weeks: Record<string, Week>;

  /**
   * The last time the week map was updated.
   */
  weeksLastRetrieved: string | null;
}

/**
 * The state related to artist information.
 */
export interface ArtistsState {
  /**
   * A map of artist IDs to the artist objects.
   *
   * This map is used to translate IDs into usernames.
   */
  artists: Record<string, Artist>;

  /**
   * A map from a username to an ID to be regenerated on every reduction.
   */
  usernameToId: Record<string, string>;

  /**
   * The last time the artist map was updated.
   */
  artistsLastRetrieved: string | null;
}

/**
 * The state related to work information.
 *
 * This is more complicated than the state for weeks and artists as there are multiple dates to
 * check depending on how a work was retrieved.
 */
export interface WorksState {
  /**
   * All of the works retrieved by the backend.
   */
  works: Record<string, Work>;

  /**
   * A map of week numbers to the last time all of the works for that week were retrieved.
   *
   * The values are date timestamps as strings.
   */
  weeksToRetrievalDate: Record<number, string>;

  /**
   * A map of artist IDs to the last time all of the works for that artist were retrieved.
   *
   * The values are date timestamps as strings.
   */
  artistsToRetrievalDate: Record<string, string>;

  /**
   * The last time _all_ of the works in the database were retrieved.
   */
  worksLastRetrieved: string | null;
}
