import type { Dispatch, SetStateAction } from 'react';
import type { BLOCK, blockArg, READONLY_BLOCK, ScriptState, SpriteState } from './types';

export const BLOCKS: READONLY_BLOCK[] = [
  { id: 1, contents: ['前へ', '$10', '歩進む'] },
  { id: 2, contents: ['右へ', '$10', '度回る'] },
  { id: 3, contents: ['左へ', '$10', '度回る'] },
  { id: 5, contents: ['後ろへ', '$10', '歩戻る'] },
  { id: 4, contents: ['$10', '秒待つ'] },
  { id: 6, contents: ['もし', '$true', 'ならば', '$innerScripts', ''] },
  { id: 7, contents: ['$10', '回繰り返す', '$innerScripts', ''] },
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
  scriptStatus: ScriptState,
  nestCount: number,
  setState: Dispatch<SetStateAction<SpriteState>>,
  setStepDelay: (newDelay: number | null) => void,
  addNestToStepCount: (nestCount: number) => void,
  resetStepCount: () => void,
  deleteNestFromStepCount: () => void,
  addNestToLoopCount: (nestCount: number) => void,
  deleteNestFromLoopCount: () => void,
  addLoopCount: () => void,
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
    6: () => {
      if (arg(0) === 'true') {
        const newNestCount = nestCount + 1;
        addNestToStepCount(newNestCount);
        const innerScripts = args[1];
        if (!(innerScripts instanceof Array)) {
          throw new Error('Invalid innerScripts');
        }
        if (scriptStatus.stepCount[scriptStatus.stepCount.length - 1] >= innerScripts.length) {
          deleteNestFromStepCount();
          return;
        }
        moves(
          fn,
          innerScripts[scriptStatus.stepCount[scriptStatus.stepCount.length - 1]].arg,
          scriptStatus,
          newNestCount,
          setState,
          setStepDelay,
          addNestToStepCount,
          resetStepCount,
          deleteNestFromStepCount,
          addNestToLoopCount,
          deleteNestFromLoopCount,
          addLoopCount,
        )[innerScripts[scriptStatus.stepCount[scriptStatus.stepCount.length - 1]].id]?.();
      }
    },
    7: () => {
      const newNestCount = nestCount + 1;
      addNestToStepCount(newNestCount);
      addNestToLoopCount(newNestCount);
      const innerScripts = args[1];
      if (!(innerScripts instanceof Array)) {
        throw new Error('Invalid innerScripts');
      }

      moves(
        fn,
        innerScripts[scriptStatus.stepCount[scriptStatus.stepCount.length - 1]].arg,
        scriptStatus,
        newNestCount,
        setState,
        setStepDelay,
        addNestToStepCount,
        resetStepCount,
        deleteNestFromStepCount,
        addNestToLoopCount,
        deleteNestFromLoopCount,
        addLoopCount,
      )[innerScripts[scriptStatus.stepCount[scriptStatus.stepCount.length - 1]].id]?.();
      if (scriptStatus.loopCount.length - 1 !== newNestCount) {
        return;
      }
      if (scriptStatus.loopCount[scriptStatus.loopCount.length - 1] >= Number(arg(0)) - 1) {
        deleteNestFromLoopCount();
        deleteNestFromStepCount();
        return;
      }
      if (scriptStatus.stepCount[scriptStatus.stepCount.length - 1] >= innerScripts.length - 1) {
        resetStepCount();
        addLoopCount();
      }
    },
  };
};
