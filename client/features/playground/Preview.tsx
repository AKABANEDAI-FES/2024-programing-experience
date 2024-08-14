import { useEffect, useState } from 'react';
import styles from './Preview.module.css';

type Props = {
  script: { id: number; arg: string[] }[] | undefined;
};

export const Preview = (props: Props) => {
  const [step, setStep] = useState([0]);
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

        const blockMoves: Record<number, () => void> = {
          1: () =>
            setState((prev) => ({
              ...prev,
              x: prev.x + Number(block.arg[0]) * Math.cos((prev.direction / 180) * Math.PI),
              y: prev.y + Number(block.arg[0]) * Math.sin((prev.direction / 180) * Math.PI),
            })),
          2: () =>
            setState((prev) => ({
              ...prev,
              direction: prev.direction + Number(block.arg[0]),
            })),
          3: () =>
            setState((prev) => ({
              ...prev,
              direction: prev.direction - Number(block.arg[0]),
            })),
        };
        blockMoves[block.id]();
        console.log(state);
        setStep((prev) => [prev[0] + 1]);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [script, step, isStart]);
  console.log(isStart);
  return (
    <div className={styles.main}>
      <button
        className={isStart ? styles.stopButton : styles.startButton}
        onClick={() => setIsStart(!isStart)}
      ></button>
      <div className={styles.preview}>
        <div
          className={styles.object}
          style={{
            top: state.y,
            left: state.x,
            transform: `rotate(${state.direction}deg)`,
          }}
        ></div>
      </div>
    </div>
  );
};
