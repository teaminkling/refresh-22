/**
 * Utils around connecting with the backend.
 */

import {AnyAction} from "redux";
import {ThunkDispatch} from "redux-thunk";
import Artist from "../data/core/Artist";
import {addArtists} from "../store/actions";
import {ArtistState, RootState} from "../store/state";

/**
 * Fetch the artists entirely if they haven't been fetched in a while.
 *
 * @param {ThunkDispatch<RootState, never, AnyAction>} dispatch the dispatch
 * @param {ArtistState} artistsData the artists data
 * @param {boolean} force whether to force a backend refresh
 */
export const updateArtists = (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  artistsData: ArtistState,
  force?: boolean,
): void => {
  const timeSinceLastFetch: number | null = artistsData.artistsLastRetrieved ? (
    new Date().valueOf() - new Date(artistsData.artistsLastRetrieved).valueOf()
  ) : null;

  if (force || !timeSinceLastFetch || timeSinceLastFetch > 1000 * 60 * 60 * 24) {
    fetch(
      "http://127.0.0.1:8787/api/artists",
      {
        headers: {"Content-Type": "application/json"},
      }
    ).then(
      (response: Response) => response.json().then(
        (data: Record<string, Artist>) => {
          dispatch(addArtists(Object.values(data)));
        }
      )
    );
  }
};
