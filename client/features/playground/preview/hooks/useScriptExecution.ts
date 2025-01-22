import type { Block } from 'common/types/playground';
import { moves } from 'features/playground/constants';
import type { blockArg, ScriptState, SpriteState } from 'features/playground/types';
import { useEffect } from 'react';

const defaultScriptState = (script: Block[]) => ({
  script,
  active: false,
  stepDelay: 0,
  stepCount: [0],
  loopCount: [0],
  nestStatus: [true],
});

export const useScriptExecution = (
  stepSpeed: number,
  scriptStates: ScriptState[],
  setScriptStates: (v: ScriptState[]) => void,
  setState: React.Dispatch<React.SetStateAction<SpriteState>>,
) => {
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

    return () => intervalIds?.forEach((intervalId) => clearInterval(intervalId));
  }, [scriptStates, stepSpeed]);

  const handleStartButtonClick = () => {
    setScriptStates(
      scriptStates
        .filter(({ script }) => script[0]?.id === 0)
        .map((scriptState) => ({
          ...scriptState,
          active: !scriptState.active,
          stepDelay: 0,
        })),
    );
  };
  return { handleStartButtonClick };
};
