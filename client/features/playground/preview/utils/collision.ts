type Rect = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

type Obstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Goal = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const checkCollision = (spriteRect: Rect, obstacles: Obstacle[]): boolean => {
  return obstacles.some(
    (obstacle) =>
      !(
        spriteRect.left > obstacle.x + obstacle.width ||
        spriteRect.right < obstacle.x ||
        spriteRect.top > obstacle.y + obstacle.height ||
        spriteRect.bottom < obstacle.y
      ),
  );
};

export const checkGoalReached = (spriteRect: Rect, goal: Goal): boolean => {
  return !(
    spriteRect.left > goal.x + goal.width ||
    spriteRect.right < goal.x ||
    spriteRect.top > goal.y + goal.height ||
    spriteRect.bottom < goal.y
  );
};
