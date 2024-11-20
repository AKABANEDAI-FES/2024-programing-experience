import type { SpriteState } from 'features/playground/types';
import type { Pos } from 'types';
import { checkCollision } from '../utils/collision';

type Props = [SpriteState, (Pos & { type: number })[], number];

export const useCollisionDetection = (...[spriteState, obstaclePoses, gridSize]: Props) => {
  const hasCollision = checkCollision(
    spriteState,
    obstaclePoses.filter((e) => e.type !== 0),
    gridSize,
  );
  const isGoaled = checkCollision(spriteState, [obstaclePoses.find((e) => e.type === 0)], gridSize);

  return { isGoaled, hasCollision };
};
