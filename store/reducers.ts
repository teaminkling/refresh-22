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
  action: AddWorksAction = {
    type: ADD_WORKS_TYPE, works: {}, source: WorkSource.DIRECT
  },
): WorksState => {
  const type: string = action.type;
  const target: number | string | undefined = action.sourceTarget;

  if (type === ADD_WORKS_TYPE) {
    let worksLastRetrieved: string | null = state.worksLastRetrieved?.slice() || null;

    const artistsToRetrievalDate: Record<string, string> = JSON.parse(
      JSON.stringify(state.artistsToRetrievalDate)
    );

    const weeksToRetrievalDate: Record<number, string> = JSON.parse(
      JSON.stringify(state.weeksToRetrievalDate)
    );

    switch ([action.source, typeof target]) {
      case [WorkSource.DIRECT, "undefined"]:
        break;
      case [WorkSource.BY_WEEK, "number"]:
        weeksToRetrievalDate[typeof target === "number" ? target : -1] = new Date().toISOString();

        break;
      case [WorkSource.BY_ARTIST, "string"]:
        artistsToRetrievalDate[typeof target === "string" ? target : "undefined"] = (
          new Date().toISOString()
        );

        break;
      case [WorkSource.SEARCH, "undefined"]:
        worksLastRetrieved = new Date().toISOString();

        break;
      default:
        throw new Error("Unknown work source type.");
    }

    return {
      works: JSON.parse(JSON.stringify(action.works)),
      worksLastRetrieved: worksLastRetrieved,
      artistsToRetrievalDate: artistsToRetrievalDate,
      weeksToRetrievalDate: weeksToRetrievalDate,
    };
  }

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
