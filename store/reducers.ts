/**
 * Reducer functions.
 *
 * A reducer is simply anything that takes a `state` and an `action` object, determines how to
 * update that state (if necessary), then returns the new state.
 *
 * In other words: `(state, action) => newState`.
 */

import {combineReducers, Reducer} from "redux";
import Artist from "../data/core/Artist";
import {AddArtistsAction, AddWeeksAction, AddWorksAction} from "./actions";
import {WorkSource} from "./enums";
import {ArtistsState, RootState, WeeksState, WorksState} from "./state";
import {ADD_ARTISTS_TYPE, ADD_WEEKS_TYPE, ADD_WORKS_TYPE} from "./types";

const artistsReducer: Reducer<ArtistsState, AddArtistsAction> = (
  state: ArtistsState = {artists: {}, usernameToId: {}, artistsLastRetrieved: null},
  action: AddArtistsAction = {type: ADD_ARTISTS_TYPE, artists: {}},
): ArtistsState => {
  const type: string = action.type;
  if (type === ADD_ARTISTS_TYPE) {
    return {
      artists: JSON.parse(JSON.stringify(action.artists)),
      artistsLastRetrieved: new Date().toISOString(),
      usernameToId: Object.fromEntries(
        Object.values(action.artists).map((artist: Artist) => [
          artist.name, artist.discordId
        ])
      ),
    };
  }

  return state;
};

const weeksReducer: Reducer<WeeksState, AddWeeksAction> = (
  state: WeeksState = {weeks: {}, weeksLastRetrieved: null},
  action: AddWeeksAction = {type: ADD_WEEKS_TYPE, weeks: {}},
): WeeksState => {
  const type: string = action.type;
  if (type === ADD_WEEKS_TYPE) {
    return {
      weeks: JSON.parse(JSON.stringify(action.weeks)),
      weeksLastRetrieved: new Date().toISOString(),
    };
  }

  return state;
};

const worksReducer: Reducer<WorksState, AddWorksAction> = (
  state: WorksState = {
    works: {}, worksLastRetrieved: null, artistsToRetrievalDate: {}, weeksToRetrievalDate: {}
  },
  action: AddWorksAction = {type: ADD_WORKS_TYPE, works: {}, source: WorkSource.DIRECT},
): WorksState => {
  return state;
};

// Define all of the reducers in the app and then combine them. It is up to contributors to keep
// track of what the reducer names are as they map directly to the root state object.

export default combineReducers<RootState>(
  {
    artistsData: artistsReducer,
    weeksData: weeksReducer,
    worksData: worksReducer,
  }
);
