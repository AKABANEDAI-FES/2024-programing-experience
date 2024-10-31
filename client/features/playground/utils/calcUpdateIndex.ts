export const calcUpdateIndex = (
  indexes: number[],
  parentIsDragOver: 'upper' | 'lower' | 'false' | undefined,
  isDragOver: 'upper' | 'lower' | 'false',
) => [
  ...indexes.slice(0, -1),
  indexes[indexes.length - 1] - +((parentIsDragOver ?? isDragOver) === 'upper'),
];
