import { AlignBox } from 'components/AlignBox';
import { useEffect, useState } from 'react';
import { moves } from '../constants';
import type { Block, SpriteState } from '../types';
import styles from './Preview.module.css';

type Props = {
  scripts: Block[][];
};

type ScriptState = {
  script: Block[];
  active: boolean;
  stepDelay: number | null;
  stepCount: number;
};

const createScriptState = (scripts: Block[][]) =>
  scripts?.map((script) => ({
    script,
    active: true,
    stepDelay: 0,
    stepCount: 0,
  }));

export const Preview = (props: Props) => {
  const { scripts } = props;
  const [stepSpeed, setStepSpeed] = useState(1);
  const [isStart, setIsStart] = useState(false);
  const [scriptStates, setScriptStates] = useState<ScriptState[]>(createScriptState(scripts));
  const [state, setState] = useState<SpriteState>({
    x: 0,
    y: 0,
    direction: 0,
  });

  useEffect(() => {
    const newScriptStates = structuredClone(scriptStates);
    const intervalIds = scriptStates.map(({ script, active, stepDelay, stepCount }, i) => {
      if (active && isStart) {
        const intervalId = setInterval(
          () => {
            if (stepCount >= (script.length ?? 0)) {
              newScriptStates[i].active = false;
              newScriptStates[i].stepCount = 0;
              newScriptStates[i].stepDelay = 0;
              setScriptStates([...newScriptStates]);
              return;
            }
            const block = script?.[stepCount];
            if (block === undefined) return;

            const step = (block: Block | string): void | string | undefined => {
              if (typeof block === 'string') {
                return block;
              }
              const setStepDelay = (newDelay: number | null) => {
                newScriptStates[i].stepDelay = newDelay;
              };

              return moves(step, block.arg, setState, setStepDelay)[block.id]?.();
            };
            newScriptStates[i].stepCount += 1;
            newScriptStates[i].stepDelay = null;
            step(block);
            setScriptStates([...newScriptStates]);
          },
          (stepDelay ?? stepSpeed) * 1000,
        );
        return intervalId;
      }
      return undefined;
    });
    return () => {
      intervalIds?.forEach((intervalId) => clearInterval(intervalId));
    };
  }, [scriptStates, isStart, stepSpeed]);

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
