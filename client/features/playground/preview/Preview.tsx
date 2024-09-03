import { AlignBox } from 'components/AlignBox';
import { useEffect, useState } from 'react';
import { moves } from '../constants';
import type { Block, blockArg, ScriptState, SpriteState } from '../types';
import styles from './Preview.module.css';

type Props = {
  scripts: Block[][];
};

export const Preview = (props: Props) => {
  const { scripts } = props;
  const [stepSpeed, setStepSpeed] = useState(1);
  const [scriptStates, setScriptStates] = useState<ScriptState[]>(
    scripts?.map((script) => ({
      script,
      active: false,
      stepDelay: 0,
      stepCount: [0],
      loopCount: [0],
      nestStatus: [true],
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

  const interval = (i: number, script: Block[], stepCount: number[]) => {
    if (stepCount[0] >= script.length) {
      updateScriptState((scriptStates) => {
        scriptStates[i].active = false;
        scriptStates[i].stepCount = [0];
        scriptStates[i].stepDelay = 0;
      });
      return;
    }

    const block = script?.[stepCount[0]];

    if (block === undefined) return;
    updateScriptState((scriptStates) => {
      const step = (block: blockArg): void | string | undefined => {
        const setStepDelay = (newDelay: number | null) => {
          scriptStates[i].stepDelay = newDelay;
        };
        const addNestToStepCount = (nestCount: number) => {
          if (scriptStates[i].stepCount.length > nestCount) {
            return;
          }
          scriptStates[i].stepCount.push(0);
        };
        const deleteNestFromStepCount = () => {
          scriptStates[i].stepCount.pop();
        };
        const resetStepCount = () => {
          scriptStates[i].stepCount[scriptStates[i].stepCount.length - 1] = -1;
        };
        const addNestToLoopCount = (nestCount: number) => {
          if (scriptStates[i].loopCount.length > nestCount) {
            return;
          }
          scriptStates[i].loopCount.push(0);
        };
        const deleteNestFromLoopCount = () => {
          scriptStates[i].loopCount.pop();
        };
        const addLoopCount = () => {
          scriptStates[i].loopCount[scriptStates[i].loopCount.length - 1] += 1;
        };
        const addNestToStatus = (nestCount: number, status: boolean) => {
          if (scriptStates[i].nestStatus.length > nestCount) {
            return;
          }
          scriptStates[i].nestStatus.push(status);
        };
        const deleteNestFromNestStatus = () => {
          scriptStates[i].nestStatus.pop();
        };
        const updateNestedStatus = (nestCount: number, status: boolean) => {
          scriptStates[i].nestStatus[scriptStates[i].nestStatus.length - 1] = status;
        };
        if (typeof block === 'string') {
          return block;
        }
        if (block instanceof Array) return;
        return moves(
          step,
          block.arg,
          scriptStates[i],
          0,
          setState,
          setStepDelay,
          addNestToStepCount,
          resetStepCount,
          deleteNestFromStepCount,
          addNestToLoopCount,
          deleteNestFromLoopCount,
          addLoopCount,
          addNestToStatus,
          deleteNestFromNestStatus,
          updateNestedStatus,
        )[block.id]?.();
      };
      step(block);
      scriptStates[i].stepCount[scriptStates[i].stepCount.length - 1] += 1;
    });
  };

  const intervalId = ({ script, active, stepDelay, stepCount }: ScriptState, i: number) => {
    if (active) {
      return setInterval(() => interval(i, script, stepCount), (stepDelay ?? stepSpeed) * 1000);
    }
    return undefined;
  };

  useEffect(() => {
    const intervalIds = scriptStates.map(intervalId);
    return () => {
      intervalIds?.forEach((intervalId) => clearInterval(intervalId));
    };
  }, [scriptStates, stepSpeed]);

  const handleStartButtonClick = () => {
    setScriptStates(
      scriptStates
        .filter(({ script }) => script[0]?.id === 0)
        .map(({ script, active, stepDelay, stepCount, loopCount, nestStatus }) => ({
          script,
          active: !active,
          stepDelay,
          stepCount,
          loopCount,
          nestStatus,
        })),
    );
  };
  return (
    <div className={styles.main}>
      <AlignBox x={'|..'}>
        <button
          className={
            scriptStates.some(({ active }) => active) ? styles.stopButton : styles.startButton
          }
          onClick={handleStartButtonClick}
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
