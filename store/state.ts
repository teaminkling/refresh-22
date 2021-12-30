/**
 * The actual state objects used in the Redux store.
 */

import Artist from "../data/core/Artist";
import Week from "../data/core/Week";
import Work from "../data/core/Work";

/**
 * A wrapper that includes a timestamp.
 */
interface DateWrapper<T> {
  /**
   * An arbitrary date.
   */
  timestamp: Date;

  /**
   * The wrapped data.
   */
  data: T;
}

/**
 * The state related to the gallery interface.
 *
 * Note that we do not remember pagination. Pagination changes the URL so users can directly
 * link to pages as long as the sort isn't random!
 */
export interface GalleryState {
  galleryLastFilter: string; // FIXME: enum

  galleryLastSort: string; // FIXME: enum
}

/**
 * The state related to week information.
 */
export interface WeekState {
  /**
   * A map of week number to week objects.
   */
  weeks: Record<number, DateWrapper<Week>>;

  /**
   * The last time the week map was updated.
   */
  weeksLastRetrieved: Date;
}

/**
 * The state related to artist information.
 */
export interface ArtistState {
  /**
   * Whether the backend is aware of the currently signed on user.
   *
   * If the user is not signed on, this is `false`.
   */
  accountExists: boolean;

  /**
   * A map of artist IDs to the artist objects.
   *
   * This map is used to translate IDs into usernames.
   */
  artists: Record<string, DateWrapper<Artist>>;

  /**
   * The last time the artist map was updated.
   */
  artistsLastRetrieved: Date;
}

/**
 * The state related to work information.
 *
 * This is more complicated than the state for weeks and artists as there are multiple dates to
 * check depending on how a work was retrieved.
 */
export interface WorkState {
  /**
   * All of the works retrieved by the backend.
   *
   * May not be exhaustive of all works in the database. Individual works are cached here with
   * the {@link DateWrapper} but are frequently retrieved (once a minute).
   */
  works: Record<string, DateWrapper<Work>>;

  /**
   * A map of week numbers to the last time all of the works for that week were retrieved.
   */
  weeksToRetrievalDate: Record<number, Date>;

  /**
   * A map of artist IDs to the last time all of the works for that artist were retrieved.
   */
  artistsToRetrievalDate: Record<string, Date>;

  /**
   * The last time _all_ of the works in the database were retrieved.
   */
  worksLastRetrieved: Date;
}
