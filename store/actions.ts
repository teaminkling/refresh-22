/**
 * Actions to be performed on state reducers.
 *
 * An action is anything that tells the reducer how to change the global state. As such, this
 * file will rarely need to be edited; only when new types are added.
 *
 * These do not have to match 1-to-1 with each reducer. There may be multiple actions per reducer.
 */

import {Action, Dispatch} from "redux";
import Artist from "../data/core/Artist";
import Week from "../data/core/Week";
import Work from "../data/core/Work";
import {WorkSource} from "./enums";
import {ADD_ARTISTS_TYPE, ADD_WEEKS_TYPE, ADD_WORKS_TYPE} from "./types";

export interface AddArtistsAction extends Action {
  artists: Record<string, Artist>;
}

const addArtistsSync = (artists: Record<string, Artist>): AddArtistsAction => {
  return {
    type: ADD_ARTISTS_TYPE,
    artists: artists,
  };
};

export const addArtists = (artists: Record<string, Artist>) => (dispatch: Dispatch): void => {
  dispatch(addArtistsSync(artists));
};

export interface AddWeeksAction extends Action {
  weeks: Record<string, Week>;
}

const addAWeeksSync = (weeks: Record<string, Week>) => {
  return {
    type: ADD_WEEKS_TYPE,
    weeks: weeks,
  };
};

export const addWeeks = (weeks: Record<string, Week>) => (dispatch: Dispatch): void => {
  dispatch(addAWeeksSync(weeks));
};

export interface AddWorksAction extends Action {
  works: Record<string, Work>;
  source: WorkSource;
  sourceTarget?: number | string;
}

const addWorksSync = (
  works: Record<string, Work>, source: WorkSource, sourceTarget?: number | string,
) => {
  return {
    type: ADD_WORKS_TYPE,
    works: works,
    source: source,
    sourceTarget: sourceTarget,
  };
};

export const addWorks = (
  works: Record<string, Work>, source: WorkSource, sourceTarget?: number | string,
) => (dispatch: Dispatch): void => {
  dispatch(addWorksSync(works, source, sourceTarget));
};
