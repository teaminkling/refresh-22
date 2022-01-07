/**
 * Utils relating to data structures.
 */

/**
 * Shuffle an array using the Schwartzian Transform algorithm.
 *
 * @param {unknown[]} array an array
 * @returns {unknown[]} a shuffled array
 */
export const shuffle = <T>(array: T[]): T[] => {
  return array.map((value: T) => ({value, sort: Math.random()})).sort(
    (
      a: { sort: number; value: T }, b: { sort: number; value: T }
    ) => a.sort - b.sort,
  ).map(({value}) => value);
};
