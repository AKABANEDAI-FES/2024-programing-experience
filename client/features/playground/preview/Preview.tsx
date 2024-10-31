import { AlignBox } from 'components/AlignBox';
import { useEffect, useState } from 'react';
import { moves } from '../constants';
import type { Block, blockArg, Scripts, ScriptState, SpriteState } from '../types';
import styles from './Preview.module.css';

type Props = {
  scripts: Scripts;
};

const defaultScriptState = (script: Block[]) => ({
  script,
  active: false,
  stepDelay: 0,
  stepCount: [0],
  loopCount: [0],
  nestStatus: [true],
});

export const Preview = (props: Props) => {
  const { scripts } = props;
  const [stepSpeed, setStepSpeed] = useState(1);

  const [scriptStates, setScriptStates] = useState<ScriptState[]>(
    scripts?.map(({ script }) => defaultScriptState(script)),
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
        scriptStates[i] = defaultScriptState(scriptStates[i].script);
      });
      return;
    }

    const block = script?.[stepCount[0]];

    if (block === undefined) return;
    updateScriptState((scriptStates) => {
      const step = (block: blockArg): void | string | undefined => {
        if (typeof block === 'string') {
          return block;
        }
        if (block instanceof Array) return;
        return moves(step, block.arg, scriptStates[i], 0, setState)[block.id]?.();
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
        .map((scriptState) => ({ ...scriptState, active: !scriptState.active, stepDelay: 0 })),
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
         />
        <input
          type="range"
          min={1}
          defaultValue={10}
          max={20}
          onChange={(e) => {
            setStepSpeed(2 - Number(e.target.value) / 10);
          }}
         />
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
         />
      </div>
    </div>
  );
};
