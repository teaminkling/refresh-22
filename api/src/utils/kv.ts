/**
 * Utils related to key-value store operations.
 */

import {Redis} from "ioredis";
import Work from "../../../data/core/Work";
import {
  WORKS_WITH_ARTIST_INDEX,
  WORKS_WITH_ID_INDEX,
  WORKS_WITH_WEEK_INDEX,
  WORKS_WITHOUT_INDEX
} from "../constants/kv";

/**
 * Place a {@link Work} at the correct places.
 *
 * This function has two modes. If setting, we write to Redis. If not setting (i.e., copying), we
 * write to KV from Redis.
 *
 * @param {Redis} redis the Redis client
 * @param {Work} work the {@link Work} to place
 * @param {KVNamespace | undefined} kv the KV store that indicates "copying mode" when provided
 */
export const placeWork = async (
  redis: Redis,
  work: Work,
  kv?: KVNamespace,
): Promise<void> => {
  // If setting, we write to Redis. If not setting, we write to KV.

  let setter: (key: string, value: string) => Promise<unknown> = redis.set;
  if (kv) {
    setter = kv.put;
  }

  // Update the ID-based map. This is agnostic to the setter above.

  if (kv) {
    await setter(`${WORKS_WITH_ID_INDEX}/${work.id}`, JSON.stringify(work));
  } else {
    await redis.set(`${WORKS_WITH_ID_INDEX}/${work.id}`, JSON.stringify(work));
  }

  // Set the artist-based map.

  const worksByArtist: Record<string, Work> = JSON.parse(
    await redis.get(`${WORKS_WITH_ARTIST_INDEX}/${work.artistId}`) || "[]"
  );

  if (!kv) {
    worksByArtist[work.id] = work;
  }

  await setter(
    `${WORKS_WITH_ARTIST_INDEX}/${work.artistId}`, JSON.stringify(worksByArtist)
  );

  // Set the week-based map.

  for (const weekNumber of work.weekNumbers) {
    const weekIndex: Record<string, Work> = JSON.parse(
      await redis.get(
        `${WORKS_WITH_WEEK_INDEX}/${work.year}/${weekNumber}`
      ) || "{}"
    );

    if (!kv) {
      weekIndex[work.id] = work;
    }

    await setter(
      `${WORKS_WITH_WEEK_INDEX}/${work.year}/${weekNumber}`, JSON.stringify(weekIndex),
    );
  }

  // Set the simple list of works.

  const worksWithoutIndex: Work[] = JSON.parse(
    await redis.get(`${WORKS_WITHOUT_INDEX}`) || "[]"
  );

  if (!kv) {
    worksWithoutIndex.push(work);
  }

  await setter(WORKS_WITHOUT_INDEX, JSON.stringify(worksWithoutIndex));
};
