/* eslint-disable max-lines */
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
  { id: 8, contents: ['$true', 'なら繰り返す', '$innerScripts', ''] },
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
  addNestToStatus: (nestCount: number, status: boolean) => void,
  deleteNestFromNestStatus: () => void,
  updateNestedStatus: (nestCount: number, status: boolean) => void,
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
      const newNestCount = nestCount + 1;
      addNestToStepCount(newNestCount);
      addNestToLoopCount(newNestCount);
      addNestToStatus(newNestCount, arg(0) === 'true');
      const innerScripts = args[1];
      if (!(innerScripts instanceof Array)) {
        throw new Error('Invalid innerScripts');
      }
      if (scriptStatus.nestStatus[newNestCount]) {
        moves(
          fn,
          innerScripts[scriptStatus.stepCount[newNestCount]].arg,
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
          addNestToStatus,
          deleteNestFromNestStatus,
          updateNestedStatus,
        )[innerScripts[scriptStatus.stepCount[newNestCount]].id]?.();
      }
      if (scriptStatus.loopCount.length - 1 !== newNestCount) {
        return;
      }
      if (scriptStatus.stepCount[newNestCount] >= innerScripts.length - 1) {
        deleteNestFromLoopCount();
        deleteNestFromStepCount();
        deleteNestFromNestStatus();
        setStepDelay(0);
      }
    },
    // eslint-disable-next-line complexity
    7: () => {
      const newNestCount = nestCount + 1;
      addNestToStepCount(newNestCount);
      addNestToLoopCount(newNestCount);
      addNestToStatus(
        newNestCount,
        scriptStatus.loopCount[scriptStatus.loopCount.length - 1] < Number(arg(0)),
      );
      const innerScripts = args[1];
      if (!(innerScripts instanceof Array)) {
        throw new Error('Invalid innerScripts');
      }
      if (scriptStatus.nestStatus[scriptStatus.nestStatus.length - 1]) {
        moves(
          fn,
          innerScripts[scriptStatus.stepCount[newNestCount]].arg,
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
          addNestToStatus,
          deleteNestFromNestStatus,
          updateNestedStatus,
        )[innerScripts[scriptStatus.stepCount[newNestCount]].id]?.();
      }
      if (scriptStatus.loopCount.length - 1 !== newNestCount) {
        return;
      }
      if (scriptStatus.loopCount[scriptStatus.loopCount.length - 1] >= Number(arg(0)) - 1) {
        deleteNestFromLoopCount();
        deleteNestFromStepCount();
        deleteNestFromNestStatus();
        setStepDelay(0);
        return;
      }
      if (scriptStatus.stepCount[newNestCount] >= innerScripts.length - 1) {
        resetStepCount();
        addLoopCount();
      }
    },
    // eslint-disable-next-line complexity
    8: () => {
      const newNestCount = nestCount + 1;
      addNestToStepCount(newNestCount);
      addNestToLoopCount(newNestCount);
      addNestToStatus(newNestCount, arg(0) === 'true');
      const innerScripts = args[1];
      if (!(innerScripts instanceof Array)) {
        throw new Error('Invalid innerScripts');
      }
      if (scriptStatus.nestStatus[newNestCount]) {
        moves(
          fn,
          innerScripts[scriptStatus.stepCount[newNestCount]].arg,
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
          addNestToStatus,
          deleteNestFromNestStatus,
          updateNestedStatus,
        )[innerScripts[scriptStatus.stepCount[newNestCount]].id]?.();
      }
      if (scriptStatus.loopCount.length - 1 !== newNestCount) {
        return;
      }
      if (!scriptStatus.nestStatus[newNestCount]) {
        deleteNestFromLoopCount();
        deleteNestFromStepCount();
        deleteNestFromNestStatus();
        setStepDelay(0);
        return;
      }
      if (scriptStatus.stepCount[newNestCount] >= innerScripts.length - 1) {
        resetStepCount();
        addLoopCount();
        updateNestedStatus(newNestCount, arg(0) === 'true');
      }
    },
  };
};
