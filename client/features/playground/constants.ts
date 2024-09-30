import type { Dispatch, SetStateAction } from 'react';
import type { BLOCK, blockArg, READONLY_BLOCK, ScriptState, SpriteState } from './types';
import { nestedStepMoveBase } from './utils/nestedStepMoveBase';
import {
  addLoopCount,
  resetStepCount,
  setStepDelay,
  updateNestedStatus,
} from './utils/scriptStatesHandler';

export const BLOCKS: READONLY_BLOCK[] = [
  { id: 0, contents: ['もし▶ボタンが押されたなら'] },
  { id: 1, contents: ['前へ', '$10', '歩進む'] },
  { id: 2, contents: ['右へ', '$10', '度回る'] },
  { id: 3, contents: ['左へ', '$10', '度回る'] },
  { id: 5, contents: ['後ろへ', '$10', '歩戻る'] },
  { id: 4, contents: ['$10', '秒待つ'] },
  { id: 6, contents: ['もし', '$true', 'ならば', []] },
  { id: 7, contents: ['$10', '回繰り返す', []] },
  { id: 8, contents: ['$true', 'なら繰り返す', []] },
];

const emptyBlockDict: Record<number, BLOCK> = {};

export const BLOCKS_DICT = BLOCKS.reduce((prev, curr) => {
  // @ts-expect-error TS2322
  prev[curr.id] = curr;
  return prev;
}, emptyBlockDict);

export const moves = (
  fn: (arg: blockArg) => void | string | undefined,
  args: blockArg[],
  scriptState: ScriptState,
  nestCount: number,
  setState: Dispatch<SetStateAction<SpriteState>>,
): Record<number, () => void> => {
  const arg = (n: number) => fn(args[n]);
  setStepDelay(scriptState, null);
  return {
    0: () => {
      setStepDelay(scriptState, 0);
    },
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
    4: () => setStepDelay(scriptState, Number(arg(0))),
    5: () =>
      setState((prev) => ({
        ...prev,
        x: prev.x - Number(arg(0)) * Math.cos((prev.direction / 180) * Math.PI),
        y: prev.y - Number(arg(0)) * Math.sin((prev.direction / 180) * Math.PI),
      })),
    6: () => {
      const newNestCount = nestCount + 1;
      const innerScripts = args[1];
      if (!(innerScripts instanceof Array)) {
        throw new Error('Invalid innerScripts');
      }
      nestedStepMoveBase(
        fn,
        scriptState,
        () => arg(0) === 'true',
        newNestCount,
        innerScripts,
        () => scriptState.stepCount[newNestCount] > innerScripts.length - 1,
        setState,
      );
    },
    7: () => {
      const newNestCount = nestCount + 1;
      const innerScripts = args[1];
      if (!(innerScripts instanceof Array)) {
        throw new Error('Invalid innerScripts');
      }
      nestedStepMoveBase(
        fn,
        scriptState,
        () => scriptState.loopCount[newNestCount] < Number(arg(0)),
        newNestCount,
        innerScripts,
        () => scriptState.loopCount[newNestCount] > Number(arg(0)) - 1,
        setState,
        () => {
          if (scriptState.stepCount[newNestCount] >= innerScripts.length - 1) {
            resetStepCount(scriptState, newNestCount);
            addLoopCount(scriptState, newNestCount);
          }
        },
      );
    },
    8: () => {
      const newNestCount = nestCount + 1;
      const innerScripts = args[1];
      if (!(innerScripts instanceof Array)) {
        throw new Error('Invalid innerScripts');
      }
      nestedStepMoveBase(
        fn,
        scriptState,
        () => arg(0) === 'true',
        newNestCount,
        innerScripts,
        () => !scriptState.nestStatus[newNestCount],
        setState,
        () => {
          if (scriptState.stepCount[newNestCount] >= innerScripts.length - 1) {
            resetStepCount(scriptState, newNestCount);
            addLoopCount(scriptState, newNestCount);
            updateNestedStatus(scriptState, newNestCount, arg(0) === 'true');
          }
        },
      );
    },
  };
};
