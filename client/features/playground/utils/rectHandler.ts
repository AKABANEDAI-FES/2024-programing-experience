export const rectHandler = (current: HTMLDivElement | null) => {
  const rect = current?.getBoundingClientRect();
  return rect ? { x: rect.x, y: rect.y, h: rect.height } : { x: 0, y: 0, h: 0 };
};
