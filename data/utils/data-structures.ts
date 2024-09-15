export const shuffle = <T>(array: T[]): T[] => {
  return array.map((value: T) => ({value, sort: Math.random()})).sort(
    (
      a: { sort: number; value: T }, b: { sort: number; value: T }
    ) => b.sort - a.sort,
  ).map(({value}) => value);
};
