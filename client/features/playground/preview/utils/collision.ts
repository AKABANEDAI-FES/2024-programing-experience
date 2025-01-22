import type { Pos } from 'types';

export const checkCollision = (
  spriteRect: Pos,
  obstaclePoses: (Pos | undefined)[],
  size: number,
): boolean => {
  const calcRight = (rect: Pos, size: number = 1) => rect.x * size + size;
  const calcBottom = (rect: Pos, size: number = 1) => rect.y * size + size;
  const calcLeft = (rect: Pos, size: number = 1) => rect.x * size;
  const calcTop = (rect: Pos, size: number = 1) => rect.y * size;

  return obstaclePoses.some(
    (obstacle) =>
      obstacle !== undefined &&
      ![
        calcLeft(spriteRect) > calcRight(obstacle, size),
        calcRight(spriteRect) < calcLeft(obstacle, size),
        calcTop(spriteRect) > calcBottom(obstacle, size),
        calcBottom(spriteRect) < calcTop(obstacle, size),
      ].some(Boolean),
  );
};
