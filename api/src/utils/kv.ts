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
 * @param {string} artistId the artist to place
 */
const incrementArtistWorkCount = async (kv: KVNamespace, artistId: string) => {
  const rawBackendArtist: string | null = await kv.get(`${ARTISTS}/${artistId}`);
  const backendArtist: Artist | undefined = (
    rawBackendArtist ? JSON.parse(rawBackendArtist) : undefined
  );

  if (backendArtist) {
    if (backendArtist.worksCount) {
      backendArtist.worksCount++;
    } else {
      backendArtist.worksCount = 1;
    }

    // As usual, this might have race conditions.

    const aggregateArtists: Record<string, Artist> = JSON.parse(
      await kv.get(`${ARTISTS}/${ACTIVE_YEAR}`) || "{}"
    );

    aggregateArtists[artistId] = backendArtist;

    await kv.put(`${ARTISTS}/${ACTIVE_YEAR}`, JSON.stringify(aggregateArtists));

    // Also put it in a guaranteed consistent call.

    await kv.put(`${ARTISTS}/${artistId}`, JSON.stringify(backendArtist));
  }
};

/**
 * Place a {@link Work} at the correct places
 *
 * @param {KVNamespace} kv the main key-value store
 * @param {Work} work the {@link Work} to place
 * @param {boolean} isNew whether this is a new work (read: not an update)
 * @param {boolean} isSkipAggregates whether to skip writing to aggregates
 * @param {boolean} isOnlyAggregates whether to only write to aggregates
 */
export const placeWork = async (
  kv: KVNamespace,
  work: Work,
  isNew: boolean,
  isSkipAggregates?: boolean,
  isOnlyAggregates?: boolean,
): Promise<void> => {
  // Update the ID-based map. This is agnostic to the setter above.

  if (!isOnlyAggregates) {
    await kv.put(`${WORKS_WITH_ID_INDEX}/${work.id}`, JSON.stringify(work));
  }

  // Set the artist-based map.

  if (!isSkipAggregates) {
    const worksByArtist: Record<string, Work> = JSON.parse(
      await kv.get(`${WORKS_WITH_ARTIST_INDEX}/${work.artistId}`) || "{}"
    );

    worksByArtist[work.id] = work;

    await kv.put(
      `${WORKS_WITH_ARTIST_INDEX}/${work.artistId}`, JSON.stringify(worksByArtist)
    );

    // Set the week-based map.

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

    // Set the simple list of works.

    const worksWithoutIndex: Work[] = JSON.parse(
      await kv.get(`${WORKS_WITHOUT_INDEX}`) || "[]"
    );

    worksWithoutIndex.push(work);

    await kv.put(WORKS_WITHOUT_INDEX, JSON.stringify(worksWithoutIndex));
  }

  // Now that the work is placed, increment the artist.

  if (isNew) {
    await incrementArtistWorkCount(kv, work.artistId);
  }
};
