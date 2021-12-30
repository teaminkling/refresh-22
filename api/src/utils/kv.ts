/**
 * Utils related to key-value store operations.
 */

import Work from "../../../data/core/Work";
import {
  WORKS_WITH_ARTIST_INDEX,
  WORKS_WITH_ID_INDEX,
  WORKS_WITH_WEEK_INDEX,
  WORKS_WITHOUT_INDEX
} from "../constants/kv";

/**
 * Place a {@link Work} at the correct places
 *
 * @param {KVNamespace} kv the main key-value store
 * @param {Work} work the {@link Work} to place
 */
export const placeWork = async (kv: KVNamespace, work: Work): Promise<void> => {
  // Update the ID-based map. This is agnostic to the setter above.

  await kv.put(`${WORKS_WITH_ID_INDEX}/${work.id}`, JSON.stringify(work));

  // Set the artist-based map.

  const worksByArtist: Record<string, Work> = JSON.parse(
    await kv.get(`${WORKS_WITH_ARTIST_INDEX}/${work.artistId}`) || "[]"
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
};
