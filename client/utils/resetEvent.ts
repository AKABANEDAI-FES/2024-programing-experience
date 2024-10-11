export const resetEvent =
  <E extends { preventDefault: () => void; stopPropagation: () => void }>(
    ps: 'p-' | 'ps' | '-s' | '--',
    fn?: (e: E) => void,
  ) =>
  (e: E) => {
    if (ps[0] === 'p') e.preventDefault();
    if (ps[1] === 's') e.stopPropagation();
    fn?.(e);
  };
