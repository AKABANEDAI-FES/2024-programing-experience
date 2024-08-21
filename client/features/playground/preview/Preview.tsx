import { AlignBox } from 'components/AlignBox';
import { useEffect, useState } from 'react';
import { moves } from '../constants';
import type { Block, SpriteState } from '../types';
import styles from './Preview.module.css';

type Props = {
  script: Block[] | undefined;
};

export const Preview = (props: Props) => {
  const [stepCounts, setStepCounts] = useState([0]);
  const [stepSpeed, setStepSpeed] = useState(1);
  const [stepDelay, setStepDelay] = useState<number | null>(null);
  const [isStart, setIsStart] = useState(false);
  const [state, setState] = useState<SpriteState>({
    x: 0,
    y: 0,
    direction: 0,
  });
  const { script } = props;
  useEffect(() => {
    if (isStart) {
      const intervalId = setInterval(
        () => {
          if (stepCounts[0] >= (script?.length ?? 0)) {
            setIsStart(false);
            setStepCounts([0]);
            clearInterval(intervalId);
            return;
          }
          const block = script?.[stepCounts[0]];
          if (block === undefined) return;

          const step = (block: Block | string): void | string | undefined => {
            if (typeof block === 'string') {
              return block;
            }

            return moves(step, block.arg, setState, setStepDelay)[block.id]?.();
          };
          step(block);
          setStepCounts((prev) => [prev[0] + 1]);
        },
        (stepDelay ?? stepSpeed) * 1000,
      );
      return () => clearInterval(intervalId);
    }
  }, [script, stepCounts, isStart]);
  return (
    <div className={styles.main}>
      <AlignBox x={'|..'}>
        <button
          className={isStart ? styles.stopButton : styles.startButton}
          onClick={() => setIsStart(!isStart)}
        ></button>
        <input
          type="range"
          min={1}
          defaultValue={10}
          max={20}
          onChange={(e) => {
            setStepSpeed(2 - Number(e.target.value) / 10);
          }}
        ></input>
      </AlignBox>
      <div className={styles.preview}>
        <div
          className={styles.sprite}
          style={{
            top: state.y,
            left: state.x,
            transform: `rotate(${state.direction}deg)`,
            transitionDuration: `${stepSpeed}s`,
          }}
        ></div>
      </div>
    </div>
  );
};
