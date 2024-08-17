import { AlignBox } from 'components/AlignBox';
import { useEffect, useState } from 'react';
import type { Block } from './Playground';
import styles from './Preview.module.css';

type Props = {
  script: Block[] | undefined;
};

export const Preview = (props: Props) => {
  const [step, setStep] = useState([0]);
  const [stepSpeed, setStepSpeed] = useState(1);
  const [isStart, setIsStart] = useState(false);
  const [state, setState] = useState({
    x: 0,
    y: 0,
    direction: 0,
  });
  const { script } = props;
  useEffect(() => {
    if (isStart) {
      const intervalId = setInterval(() => {
        if (step[0] >= (script?.length ?? 0)) {
          setIsStart(false);
          setStep([0]);
          clearInterval(intervalId);
          return;
        }
        const block = script?.[step[0]];
        if (block === undefined) return;

        const blockMoves = (block: Block | string): (() => void) | string => {
          if (typeof block === 'string') {
            return block;
          }

          const moves = (
            fn: (arg: Block | string) => (() => void) | string,
            args: (Block | string)[],
          ) =>
            ({
              1: () =>
                setState((prev) => ({
                  ...prev,
                  x: prev.x + Number(fn(args[0])) * Math.cos((prev.direction / 180) * Math.PI),
                  y: prev.y + Number(fn(args[0])) * Math.sin((prev.direction / 180) * Math.PI),
                })),
              2: () =>
                setState((prev) => ({
                  ...prev,
                  direction: prev.direction + Number(fn(args[0])),
                })),
              3: () => {
                setState((prev) => ({
                  ...prev,
                  direction: prev.direction - Number(fn(args[0])),
                }));
              },
            })[block.id];

          return moves(blockMoves, block.arg)?.() ?? '';
        };
        blockMoves(block);
        setStep((prev) => [prev[0] + 1]);
      }, stepSpeed * 1000);
      return () => clearInterval(intervalId);
    }
  }, [script, step, isStart]);
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
          className={styles.object}
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
