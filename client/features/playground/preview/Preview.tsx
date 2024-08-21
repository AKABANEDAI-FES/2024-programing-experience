import { AlignBox } from 'components/AlignBox';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import type { Block } from './Playground';
import styles from './Preview.module.css';

type Props = {
  script: Block[] | undefined;
};

type SpriteState = {
  x: number;
  y: number;
  direction: number;
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

            const moves = (
              fn: (arg: Block | string) => void | string | undefined,
              args: (Block | string)[],
              setState: Dispatch<SetStateAction<SpriteState>>,
            ): Record<number, () => void> => {
              const arg = (n: number) => fn(args[n]);
              setStepDelay(null);
              return {
                1: () =>
                  setState((prev) => ({
                    ...prev,
                    x: prev.x + Number(arg(0)) * Math.cos((prev.direction / 180) * Math.PI),
                    y: prev.y + Number(arg(0)) * Math.sin((prev.direction / 180) * Math.PI),
                  })),
                2: () =>
                  setState((prev) => ({
                    ...prev,
                    direction: prev.direction + Number(arg(0)),
                  })),
                3: () => {
                  setState((prev) => ({
                    ...prev,
                    direction: prev.direction - Number(arg(0)),
                  }));
                },
                4: () => setStepDelay(Number(arg(0))),
                5: () =>
                  setState((prev) => ({
                    ...prev,
                    x: prev.x - Number(arg(0)) * Math.cos((prev.direction / 180) * Math.PI),
                    y: prev.y - Number(arg(0)) * Math.sin((prev.direction / 180) * Math.PI),
                  })),
              };
            };

            return moves(step, block.arg, setState)[block.id]?.();
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
