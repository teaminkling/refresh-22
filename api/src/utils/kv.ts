/**
 * Utils related to key-value store operations.
 */

import {ACTIVE_YEAR} from "../../../data/constants/setup";
import Artist from "../../../data/core/Artist";
import Work from "../../../data/core/Work";
import {
  ARTISTS,
  WORKS_WITH_ARTIST_INDEX,
  WORKS_WITH_ID_INDEX,
  WORKS_WITH_WEEK_INDEX,
  WORKS_WITHOUT_INDEX
} from "../constants/kv";

/**
 * Increment an artist's work count.
 *
 * @param {KVNamespace} kv the main key-value store
 * @param {Work} work the work with the artist and first artist details, if required
 */
const incrementArtistWorkCount = async (kv: KVNamespace, work: Work) => {
  const rawArtist: string | null = await kv.get(`${ARTISTS}/${work.artistId}`);
  const artist: Artist | undefined = (
    rawArtist ? JSON.parse(rawArtist) : undefined
  ) || work.firstSeenArtistInfo;

  if (artist) {
    if (artist.worksCount) {
      artist.worksCount++;
    } else {
      artist.worksCount = 1;
    }

    // As usual, this might have race conditions.

    const aggregateArtists: Record<string, Artist> = JSON.parse(
      await kv.get(`${ARTISTS}/${ACTIVE_YEAR}`) || "{}"
    );

    aggregateArtists[work.artistId] = artist;

    await kv.put(`${ARTISTS}/${ACTIVE_YEAR}`, JSON.stringify(aggregateArtists));

    // Also put it in a guaranteed consistent call.

    await kv.put(`${ARTISTS}/${work.artistId}`, JSON.stringify(artist));
  }
};

/**
 * Place a {@link Work} at the correct places.
 *
 * It's likely the aggregates booleans won't be used, but they're there for the time being.
 *
 * @param {KVNamespace} kv the main key-value store
 * @param {Work} work the {@link Work} to place
 * @param {boolean} isNew whether this is a new work (read: not an update)
 * @param {boolean} isSkipArtist whether to skip writing to artist aggregates
 * @param {boolean} isSkipWeek whether to skip writing to week aggregates
 * @param {boolean} isSkipList whether to skip writing the overarching list of all works
 */
export const placeWork = async (
  kv: KVNamespace,
  work: Work,
  isNew: boolean,
  isSkipArtist?: boolean,
  isSkipWeek?: boolean,
  isSkipList?: boolean,
): Promise<void> => {
  // Update the ID-based map. This is agnostic to the setter above.

  await kv.put(`${WORKS_WITH_ID_INDEX}/${work.id}`, JSON.stringify(work));

  // Set the artist-based map.

  if (!isSkipArtist) {
    const worksByArtist: Record<string, Work> = JSON.parse(
      await kv.get(`${WORKS_WITH_ARTIST_INDEX}/${work.artistId}`) || "{}"
    );

    worksByArtist[work.id] = work;

    await kv.put(
      `${WORKS_WITH_ARTIST_INDEX}/${work.artistId}`, JSON.stringify(worksByArtist)
    );
  }

  // Set the week-based map.

  if (!isSkipWeek) {
    for (const weekNumber of work.weekNumbers) {
      const weekIndex: Record<string, Work> = JSON.parse(
        await kv.get(
          `${WORKS_WITH_WEEK_INDEX}/${work.year}/${weekNumber}`
        ) || "{}"
      );

      weekIndex[work.id] = work;

      await kv.put(
        `${WORKS_WITH_WEEK_INDEX}/${work.year}/${weekNumber}`, JSON.stringify(weekIndex),
      );
    }
  }

  // Set the simple list of works.

  if (!isSkipList) {
    const worksWithoutIndex: Work[] = JSON.parse(
      await kv.get(`${WORKS_WITHOUT_INDEX}`) || "[]"
    );

    worksWithoutIndex.push(work);

    await kv.put(WORKS_WITHOUT_INDEX, JSON.stringify(worksWithoutIndex));
  }

  // Now that the work is placed, increment the artist.

  if (isNew) {
    await incrementArtistWorkCount(kv, work);
  }
};
