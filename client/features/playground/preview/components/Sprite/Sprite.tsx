import styles from './Sprite.module.css';

type SpriteProps = {
  state: { x: number; y: number; direction: number };
  stepSpeed: number;
  hasReachedGoal: boolean;
  collisions: boolean;
};

export const Sprite = ({ state, stepSpeed, hasReachedGoal, collisions }: SpriteProps) => (
  <div
    className={styles.sprite}
    style={{
      top: state.y,
      left: state.x,
      transform: `rotate(${state.direction}deg)`,
      transitionDuration: `${stepSpeed}s`,
      backgroundColor: hasReachedGoal ? 'gold' : collisions ? 'red' : 'blue',
    }}
  />
);
