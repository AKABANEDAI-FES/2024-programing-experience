import styles from './Sprite.module.css';

type SpriteProps = {
  state: { x: number; y: number; direction: number };
  stepSpeed: number;
  isGoaled: boolean;
  hasCollision: boolean;
  gridSize: number;
};

export const Sprite = ({
  state,
  stepSpeed,
  isGoaled: hasReachedGoal,
  hasCollision: collisions,
  gridSize,
}: SpriteProps) => (
  <div
    className={styles.sprite}
    style={{
      top: state.y,
      width: gridSize,
      left: state.x,
      transform: `rotate(${state.direction}deg)`,
      transitionDuration: `${stepSpeed}s`,
      backgroundColor: hasReachedGoal ? 'gold' : collisions ? 'red' : 'blue',
    }}
  />
);
