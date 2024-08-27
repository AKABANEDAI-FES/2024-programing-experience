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

export const Preview = (props: Props) => {
  const { scripts } = props;
  const [stepSpeed, setStepSpeed] = useState(1);
  const [isStart, setIsStart] = useState(false);
  const [scriptStates, setScriptStates] = useState<ScriptState[]>(
    scripts?.map((script) => ({
      script,
      active: true,
      stepDelay: 0,
      stepCount: 0,
    })),
  );
  const [state, setState] = useState<SpriteState>({
    x: 0,
    y: 0,
    direction: 0,
  });

  const updateScriptState = (updateFn: (newScriptStates: ScriptState[]) => void) => {
    const newScriptStates = structuredClone(scriptStates);
    updateFn(newScriptStates);
    setScriptStates([...newScriptStates]);
  };

  const interval = (i: number, script: Block[], stepCount: number) => {
    if (stepCount >= script.length) {
      updateScriptState((scriptStates) => {
        scriptStates[i].active = false;
        scriptStates[i].stepCount = 0;
        scriptStates[i].stepDelay = 0;
      });
      return;
    }

    const block = script?.[stepCount];

    if (block === undefined) return;

    updateScriptState((scriptStates) => {
      const step = (block: Block | string): void | string | undefined => {
        const setStepDelay = (newDelay: number | null) => {
          scriptStates[i].stepDelay = newDelay;
        };

        if (typeof block === 'string') {
          return block;
        }
        return moves(step, block.arg, setState, setStepDelay)[block.id]?.();
      };

      scriptStates[i].stepCount += 1;
      scriptStates[i].stepDelay = null;
      step(block);
    });
  };

  const intervalId = ({ script, active, stepDelay, stepCount }: ScriptState, i: number) => {
    if (active && isStart) {
      const intervalId = setInterval(
        () => interval(i, script, stepCount),
        (stepDelay ?? stepSpeed) * 1000,
      );
      return intervalId;
    }
    return undefined;
  };

  useEffect(() => {
    const intervalIds = scriptStates.map(intervalId);
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
