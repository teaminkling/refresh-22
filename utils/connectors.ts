/**
 * Utils around connecting with the backend.
 */

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
 * @param {Record<string, string>} data the state
 * @param {Date | null} lastRetrieved the last retrieval date
 * @param {string | undefined} token the token if required
 * @param {boolean} force whether to force a backend refresh
 */
const fetchGeneric = async <T, R>(
  endpoint: string,
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  action: (data: R) => (dispatch: Dispatch) => void,
  data: T,
  lastRetrieved: string | null,
  token?: string,
  force?: boolean,
) => {
  const now: moment.Moment = moment().tz("Australia/Melbourne");
  const lastRetrievedMoment: moment.Moment | null = lastRetrieved ? moment(
    lastRetrieved
  ).tz("Australia/Melbourne") : null;

  const timeSinceLastFetch: number | null = lastRetrievedMoment ? (
    now.valueOf() - lastRetrievedMoment.valueOf()
  ) : null;

  if (
    force
    || !timeSinceLastFetch
    || timeSinceLastFetch > 1000 * 60 * 5
    || lastRetrievedMoment && (now.hour() > lastRetrievedMoment.hour())
  ) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = token;
    }

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
  token?: string,
  force?: boolean,
) => {
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

export const fetchWeeks = async (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  weeksData: WeeksState,
  token?: string,
  force?: boolean,
) => {
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

/**
 * Fetch works, either entirely or via a search query.
 *
 * This endpoint could fetch stale or incomplete data due to race conditions. It is validated
 * once a day, which is how often race condition-affected works would need to be re-approved.
 *
 * @param {ThunkDispatch<RootState, never, AnyAction>} dispatch the dispatch
 * @param {WorksState} worksData the works data
 * @param {string | undefined} query if provided, the query part, including the `?` character
 * @param {string | undefined} token the token
 * @param {boolean | undefined} force whether to force a retrieval
 */
export const fetchWorks = async (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  worksData: WorksState,
  query?: string,
  token?: string,
  force?: boolean,
) => {
  return fetchGeneric<WorksState, Record<string, Work>>(
    `/api/works${query}`,
    dispatch,
    (works: Record<string, Work>) => addWorks(works, WorkSource.SEARCH),
    worksData,
    worksData.worksLastRetrieved,
    token,
    force,
  );
};

export const fetchWorkById = async (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  worksData: WorksState,
  id: string,
  token?: string,
) => {
  return fetchGeneric<WorksState, Record<string, Work>>(
    `/api/work?id=${id}`,
    dispatch,
    (works: Record<string, Work>) => addWorks(works, WorkSource.DIRECT),
    worksData,
    null,
    token,
    true,
  );
};

export const fetchWorksByWeek = async (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  worksData: WorksState,
  week: number,
  token?: string,
  force?: boolean,
) => {
  return fetchGeneric<WorksState, Record<string, Work>>(
    `/api/works?week=${week}`,
    dispatch,
    (works: Record<string, Work>) => addWorks(works, WorkSource.BY_WEEK, week),
    worksData,
    worksData.weeksToRetrievalDate[week],
    token,
    force,
  );
};

export const fetchWorksByArtist = async (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  worksData: WorksState,
  artist: string,
  token?: string,
  force?: boolean,
) => {
  return fetchGeneric<WorksState, Record<string, Work>>(
    `/api/works?artist=${artist}`,
    dispatch,
    (works: Record<string, Work>) => addWorks(works, WorkSource.BY_ARTIST, artist),
    worksData,
    worksData.artistsToRetrievalDate[artist],
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
  const response: Response = await fetch(
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

  const response: Response = await fetch(
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

export const putWork = async (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  worksData: WorksState,
  token: string,
  work: Work,
): Promise<Work> => {
  const response: Response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"}/api/work`,
    {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(work),
    }
  );

  // Parse the work that was posted if successful.

  if (response.ok) {
    const returnedWork: Work = await response.json();

    if (returnedWork.id !== "noop") {
      worksData.works[returnedWork.id] = returnedWork;

      dispatch(addWorks(worksData.works, WorkSource.DIRECT));
    }

    return returnedWork;
  }

  throw new Error(await response.text());
};

/**
 * Upload a file and return the remote public URL.
 *
 * @param {string} token the access token
 * @param {File} file the file to upload
 * @returns {Promise<string>} the public URL
 */
export const uploadFile = async (
  token: string, file: File,
): Promise<string> => {
  const presignedUrlResponse: Response = await fetch(
    `${process.env["NEXT_PUBLIC_API_URL"] || "http://localhost:8787"}/api/upload`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        filename: file.name,
        contentLength: file.size,
      }),
    }
  );

  if (presignedUrlResponse.ok) {
    // Explode here on malformed/unexpected JSON from the endpoint.

    const url: URL = new URL((await presignedUrlResponse.json())["data"]["url"]);

    const bucketName: string = url.hostname.split(".")[0];

    // Perform the upload.

    await fetch(
      url.toString(),
      {
        method: "put",
        headers: {
          "X-Amz-Content-Sha256": "UNSIGNED-PAYLOAD",
          "Content-Length": file.size.toString(),
        },
        body: file,
      }
    );

    return `https://refresh-cdn.fiveclawd.com/file/${bucketName}${url.pathname}`;
  }

  throw new Error(await presignedUrlResponse.text());
};

/**
 * Ask the backend to approve some works.
 *
 * @param {string} token the access token
 * @param {string[]} works the works to approve by ID
 * @param {ThunkDispatch<RootState, never, AnyAction> | undefined} dispatch the dispatch
 * @param {WorksState | undefined} worksData the state
 */
export const approveWorks = async (
  token: string,
  works: string[],
  dispatch?: ThunkDispatch<RootState, never, AnyAction>,
  worksData?: WorksState,
): Promise<void> => {
  const response: Response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"}/api/approve`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(works),
    }
  );

  if (response.ok) {
    // If we want to, we could modify the state directly so the editor immediately sees works.

    if (dispatch && worksData) {
      // Create a copy of the works data where the IDs we've presented are approved.

      const newWorks: Record<string, Work> = {};
      Object.values(worksData.works).filter((work: Work) => works.includes(work.id)).forEach(
        (work: Work) => {
          work.isApproved = true;

          newWorks[work.id] = work;
        }
      );

      dispatch(addWorks(newWorks, WorkSource.DIRECT));
    }
  } else {
    throw new Error(await response.text());
  }
};


/**
 * Ask the backend to delete some works.
 *
 * @param {string} token the access token
 * @param {string[]} works the works to delete by ID
 * @param {ThunkDispatch<RootState, never, AnyAction> | undefined} dispatch the dispatch
 * @param {WorksState | undefined} worksData the state
 */
export const deleteWorks = async (
  token: string,
  works: string[],
  dispatch?: ThunkDispatch<RootState, never, AnyAction>,
  worksData?: WorksState,
): Promise<void> => {
  const response: Response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"}/api/work`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(works),
    }
  );

  if (response.ok) {
    if (dispatch && worksData) {
      const newWorks: Record<string, Work> = {};
      Object.values(worksData.works).filter((work: Work) => works.includes(work.id)).forEach(
        (work: Work) => {
          work.isApproved = false;
          work.isSoftDeleted = true;

          newWorks[work.id] = work;
        }
      );

      dispatch(addWorks(newWorks, WorkSource.DIRECT));
    }
  } else {
    throw new Error(await response.text());
  }
};
