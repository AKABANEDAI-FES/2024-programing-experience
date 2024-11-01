export const calcUpdateIndex = (
  indexes: number[],
  parentIsDragOver: 'upper' | 'lower' | 'false' | undefined,
  isDragOver: 'upper' | 'lower' | 'false',
  isNotShadow: boolean,
) => {
  return [
    ...indexes.slice(0, indexes.length - Number(!isNotShadow)).slice(0, -1),
    (indexes.slice(0, indexes.length - Number(!isNotShadow)).at(-1) ?? 0) -
      +((parentIsDragOver ?? isDragOver) === 'upper'),
  ];
};
