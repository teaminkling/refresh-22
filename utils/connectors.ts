/**
 * Utils around connecting with the backend.
 */

import {AnyAction, Dispatch} from "redux";
import {ThunkDispatch} from "redux-thunk";
import Artist from "../data/core/Artist";
import Week from "../data/core/Week";
import {addArtists, addWeeks} from "../store/actions";
import {ArtistsState, RootState, WeeksState} from "../store/state";

/**
 * Perform a generic PUT request to the backend for aggregate types.
 *
 * @param {string} endpoint the endpoint path with a slash at the start
 * @param {ThunkDispatch<RootState, never, AnyAction>} dispatch the dispatch
 * @param {CallableFunction} action the action used with the dispatch
 * @param {Record<string, string>} data the state
 * @param {Date | null} lastRetrieved the last retrieval date
 * @param {boolean} force whether to force a backend refresh
 */
const updateGeneric = <T, R>(
  endpoint: string,
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  action: (data: R) => (dispatch: Dispatch) => void,
  data: T,
  lastRetrieved: string | null,
  force?: boolean,
) => {
  const timeSinceLastFetch: number | null = lastRetrieved ? (
    new Date().valueOf() - new Date(lastRetrieved).valueOf()
  ) : null;

  if (force || !timeSinceLastFetch || timeSinceLastFetch > 1000 * 60 * 60 * 24) {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"}${endpoint}`,
      {
        headers: {"Content-Type": "application/json"},
      }
    ).then(
      (response: Response) => response.json().then(
        (_data: R) => dispatch(action(_data))
      )
    );
  }
};

export const updateArtists = (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  artistsData: ArtistsState,
  force?: boolean,
): void => {
  return updateGeneric<ArtistsState, Record<string, Artist>>(
    "/api/artists",
    dispatch,
    addArtists,
    artistsData,
    artistsData.artistsLastRetrieved,
    force,
  );
};

export const updateWeeks = (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  weeksData: WeeksState,
  force?: boolean,
): void => {
  return updateGeneric<WeeksState, Record<string, Week>>(
    "/api/weeks",
    dispatch,
    addWeeks,
    weeksData,
    weeksData.weeksLastRetrieved,
    force,
  );
};
