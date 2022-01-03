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
 * Perform a generic GET request to the backend for aggregate types.
 *
 * @param {string} endpoint the endpoint path with a slash at the start
 * @param {ThunkDispatch<RootState, never, AnyAction>} dispatch the dispatch
 * @param {CallableFunction} action the action used with the dispatch
 * @param {Record<string, string>} data the state
 * @param {Date | null} lastRetrieved the last retrieval date
 * @param {string | undefined} token the token if required
 * @param {boolean} force whether to force a backend refresh
 */
const fetchGeneric = <T, R>(
  endpoint: string,
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  action: (data: R) => (dispatch: Dispatch) => void,
  data: T,
  lastRetrieved: string | null,
  token?: string,
  force?: boolean,
) => {
  const timeSinceLastFetch: number | null = lastRetrieved ? (
    new Date().valueOf() - new Date(lastRetrieved).valueOf()
  ) : null;

  if (force || !timeSinceLastFetch || timeSinceLastFetch > 1000 * 60 * 60 * 24) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = token;
    }

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"}${endpoint}`,
      {headers: headers},
    ).then(
      (response: Response) => response.json().then(
        (_data: R) => dispatch(action(_data))
      )
    );
  }
};

export const fetchArtists = (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  artistsData: ArtistsState,
  token?: string,
  force?: boolean,
): void => {
  return fetchGeneric<ArtistsState, Record<string, Artist>>(
    "/api/artists",
    dispatch,
    addArtists,
    artistsData,
    artistsData.artistsLastRetrieved,
    token,
    force,
  );
};

export const fetchWeeks = (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  weeksData: WeeksState,
  token?: string,
  force?: boolean,
): void => {
  return fetchGeneric<WeeksState, Record<string, Week>>(
    "/api/weeks",
    dispatch,
    addWeeks,
    weeksData,
    weeksData.weeksLastRetrieved,
    token,
    force,
  );
};

export const putArtist = async (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  artistsData: ArtistsState,
  token: string,
  artist: Artist,
): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"}/api/artist`,
    {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(artist),
    }
  );

  if (response.ok) {
    // We don't need to worry about copying the objects because the reducers will do that for us.

    artistsData.artists[artist.discordId] = artist;

    dispatch(addArtists(artistsData.artists));
  } else {
    throw new Error(await response.text());
  }
};

export const putWeeks = async (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  weeksData: WeeksState,
  token: string,
  weeks: Record<number, Week>,
) => {
  // Start by removing weeks that have no content.

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"}/api/weeks`,
    {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(weeks),
    }
  );

  if (response.ok) {
    dispatch(addWeeks(weeks));
  } else {
    throw new Error(await response.text());
  }
};
