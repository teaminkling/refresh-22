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
import {AddArtistsAction} from "./actions";
import {ArtistState} from "./state";
import {ADD_ARTISTS_TYPE} from "./types";

/**
 * A reducer the keeps track of the listener reference.
 *
 * @param {ArtistState} state the current state
 * @param {AddArtistsAction} action the action
 * @returns {ArtistState} the resultant (future) state
 */
const artistsReducer: Reducer<ArtistState, AddArtistsAction> = (
  state: ArtistState = {artists: {}, artistsLastRetrieved: null},
  action: AddArtistsAction = {type: ADD_ARTISTS_TYPE, artists: []},
): ArtistState => {
  const type: string = action.type;

  if (type === ADD_ARTISTS_TYPE) {
    return {
      artists: Object.fromEntries(
        action.artists.map((artist: Artist) => [
          artist.discordId, {data: artist, timestamp: new Date()}
        ])
      ),
      artistsLastRetrieved: new Date(),
    };
  }

  return state;
};

// Define all of the reducers in the app and then combine them. It is up to contributors to keep
// track of what the reducer names are as they map directly to the root state object.

export default combineReducers(
  {
    artistsData: artistsReducer,
  }
);
