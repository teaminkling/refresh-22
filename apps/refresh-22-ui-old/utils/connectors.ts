import moment from "moment-timezone";
import {AnyAction, Dispatch} from "redux";
import {ThunkDispatch} from "redux-thunk";
import Artist from "../data/core/Artist";
import Week from "../data/core/Week";
import Work from "../data/core/Work";
import {addArtists, addWeeks, addWorks} from "../store/actions";
import {WorkSource} from "../store/enums";
import {ArtistsState, RootState, WeeksState, WorksState} from "../store/state";

/**
 * Perform a generic GET request to the backend for aggregate types.
 *
 * The request will re-process every 30 minutes or on the turn of every hour.
 *
 * @param {string} endpoint the endpoint path with a slash at the start
 * @param {ThunkDispatch<RootState, never, AnyAction>} dispatch the dispatch
 * @param {CallableFunction} action the action used with the dispatch
 * @param {Date | null} lastRetrieved the last retrieval date
 */
const fetchGeneric = async <R>(
  endpoint: string,
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  action: (data: R) => (dispatch: Dispatch) => void,
  lastRetrieved: string | null,
) => {
  const now: moment.Moment = moment().tz("Australia/Melbourne");
  const lastRetrievedMoment: moment.Moment | null = lastRetrieved ? moment(
    lastRetrieved
  ).tz("Australia/Melbourne") : null;

  const timeSinceLastFetch: number | null = lastRetrievedMoment ? (
    now.valueOf() - lastRetrievedMoment.valueOf()
  ) : null;

  if (
    !timeSinceLastFetch
    || timeSinceLastFetch > 1000 * 60 * 5
    || lastRetrievedMoment && (now.hour() > lastRetrievedMoment.hour())
  ) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const response: Response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"}${endpoint}`,
      {headers: headers},
    );

    const json: R = await response.json();
    if (response.ok) {
      return dispatch(action(json));
    }

    throw json;
  }
};

export const fetchArtists = async (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  artistsData: ArtistsState,
) => {
  return fetchGeneric<Record<string, Artist>>(
    "/api/artists",
    dispatch,
    addArtists,
    artistsData.artistsLastRetrieved,
  );
};

export const fetchWeeks = async (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  weeksData: WeeksState,
) => {
  return fetchGeneric<Record<string, Week>>(
    "/api/weeks",
    dispatch,
    addWeeks,
    weeksData.weeksLastRetrieved,
  );
};

export const fetchWorkById = async (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  id: string,
) => {
  return fetchGeneric<Record<string, Work>>(
    `/api/work?id=${id}`,
    dispatch,
    (works: Record<string, Work>) => addWorks(works, WorkSource.DIRECT),
    null,
  );
};

export const fetchWorksByWeek = async (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  worksData: WorksState,
  week: number,
) => {
  return fetchGeneric<Record<string, Work>>(
    `/api/works?week=${week}`,
    dispatch,
    (works: Record<string, Work>) => addWorks(works, WorkSource.BY_WEEK, week),
    worksData.weeksToRetrievalDate[week],
  );
};

export const fetchWorksByArtist = async (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  worksData: WorksState,
  artist: string,
) => {
  return fetchGeneric<Record<string, Work>>(
    `/api/works?artist=${artist}`,
    dispatch,
    (works: Record<string, Work>) => addWorks(works, WorkSource.BY_ARTIST, artist),
    worksData.artistsToRetrievalDate[artist],
  );
};
