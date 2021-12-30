/**
 * Actions to be performed on state reducers.
 *
 * An action is anything that tells the reducer how to change the global state. As such, this
 * file will rarely need to be edited; only when new types are added.
 *
 * These do not have to match 1-to-1 with each reducer. There may be multiple actions per reducer.
 */

import {Property} from "csstype";
import {Action, Dispatch} from "redux";
import Artist from "../data/core/Artist";
import Week from "../data/core/Week";
import Work from "../data/core/Work";
import {Sort, WorkSource} from "./enums";
import {ADD_ARTISTS_TYPE, ADD_WEEKS_TYPE, ADD_WORKS_TYPE, GALLERY_MUTATION_TYPE} from "./types";
import Filter = Property.Filter;

/**
 * The gallery settings are changed.
 */
export interface ChangeGallerySettingsAction extends Action {
  sort: Sort;
  filter: Filter;
}

const changeGallerySettingsSync = (sort: Sort, filter: Filter): ChangeGallerySettingsAction => {
  return {
    type: GALLERY_MUTATION_TYPE,
    sort: sort,
    filter: filter,
  };
};

/**
 * Change the gallery settings.
 *
 * @param {Sort} sort the sort
 * @param {Property.Filter} filter the filter
 * @returns {CallableFunction} the thunk action creator
 */
export const changeGallerySettings = (
  sort: Sort, filter: Filter
) => (dispatch: Dispatch): void => {
  dispatch(changeGallerySettingsSync(sort, filter));
};

/**
 * (An) artist(s) is/are added to the frontend cache.
 */
export interface AddArtistsAction extends Action {
  artists: Artist[];
}

const addArtistsSync = (artists: Artist[]): AddArtistsAction => {
  return {
    type: ADD_ARTISTS_TYPE,
    artists: artists,
  };
};

/**
 * Add artists to the cache.
 *
 * @param {Artist[]} artists the artists
 * @returns {CallableFunction} the thunk action creator
 */
export const addArtists = (artists: Artist[]) => (dispatch: Dispatch): void => {
  dispatch(addArtistsSync(artists));
};

/**
 * Weeks are added to the frontend cache.
 *
 * This is always called with all weeks even if only one is required.
 */
export interface AddWeeksAction extends Action {
  weeks: Week[];
}

const addAWeeksSync = (weeks: Week[]): AddWeeksAction => {
  return {
    type: ADD_WEEKS_TYPE,
    weeks: weeks,
  };
};

/**
 * Add weeks to the cache.
 *
 * @param {Week[]} weeks the weeks
 * @returns {CallableFunction} the thunk action creator
 */
export const addWeeks = (weeks: Week[]) => (dispatch: Dispatch): void => {
  dispatch(addAWeeksSync(weeks));
};

/**
 * (A) work(s) is/are added to the frontend cache.
 *
 * This is more complicated than adding an artist or week. This modifies multiple caches
 * depending on what is called.
 */
export interface AddWorksAction extends Action {
  works: Work[];
  source: WorkSource;
}

const addWorksSync = (works: Work[], source: WorkSource): AddWorksAction => {
  return {
    type: ADD_WORKS_TYPE,
    works: works,
    source: source,
  };
};

/**
 * Add artists to the cache.
 *
 * @param {Work[]} works the works
 * @param {WorkSource} source the source of the works request
 * @returns {CallableFunction} the thunk action creator
 */
export const addWorks = (works: Work[], source: WorkSource) => (dispatch: Dispatch): void => {
  dispatch(addWorksSync(works, source));
};
