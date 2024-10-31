import type { SpriteState } from 'features/playground/types';
import { useEffect, useState } from 'react';
import { goal } from '../constants';
import { checkCollision, checkGoalReached } from '../utils/collision';

export const useCollisionDetection = (state: SpriteState) => {
  const [hasReachedGoal, setHasReachedGoal] = useState(false);
  const [collisions, setCollisions] = useState(false);

  const [obstacles] = useState([
    { x: 100, y: 100, width: 50, height: 50 },
    { x: 200, y: 200, width: 50, height: 50 },
  ]);

  useEffect(() => {
    const spriteSize = { width: 30, height: 30 };

    const spriteRect = {
      left: state.x,
      right: state.x + spriteSize.width,
      top: state.y,
      bottom: state.y + spriteSize.height,
    };

    const hasCollision = checkCollision(spriteRect, obstacles);
    const reachedGoal = checkGoalReached(spriteRect, goal);

    setCollisions(hasCollision);
    setHasReachedGoal(reachedGoal);
  }, [state]);

  return { hasReachedGoal, collisions };
};
