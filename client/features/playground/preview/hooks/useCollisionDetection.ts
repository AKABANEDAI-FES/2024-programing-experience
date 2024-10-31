import type { SpriteState } from 'features/playground/types';
import { useEffect, useState } from 'react';
import { goal } from '../constants';

export const useCollisionDetection = (state: SpriteState) => {
  const [hasReachedGoal, setHasReachedGoal] = useState(false);
  const [collisions, setCollisions] = useState(false);

  const [obstacles] = useState([
    { x: 100, y: 100, width: 50, height: 50 },
    { x: 200, y: 200, width: 50, height: 50 },
  ]);

  // 衝突とゴール判定のロジック

  //eslint-disable-next-line complexity
  useEffect(() => {
    const spriteSize = { width: 30, height: 30 }; // スプライトのサイズ

    const spriteRect = {
      left: state.x,
      right: state.x + spriteSize.width,
      top: state.y,
      bottom: state.y + spriteSize.height,
    };

    const hasCollision = obstacles.some(
      (obstacle) =>
        !(
          spriteRect.left > obstacle.x + obstacle.width ||
          spriteRect.right < obstacle.x ||
          spriteRect.top > obstacle.y + obstacle.height ||
          spriteRect.bottom < obstacle.y
        ),
    );

    const reachedGoal = !(
      spriteRect.left > goal.x + goal.width ||
      spriteRect.right < goal.x ||
      spriteRect.top > goal.y + goal.height ||
      spriteRect.bottom < goal.y
    );

    // 衝突が発生した場合の処理
    if (hasCollision) {
      setCollisions(true);
    } else {
      setCollisions(false);
    }

    // ゴールに到達した場合の処理
    if (reachedGoal) {
      setHasReachedGoal(true);
    }
  }, [state]); // obstaclesを依存配列に追加

  return { hasReachedGoal, collisions };
};
