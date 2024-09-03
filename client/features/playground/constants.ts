import type { Dispatch, SetStateAction } from 'react';
import type { BLOCK, blockArg, READONLY_BLOCK, ScriptState, SpriteState } from './types';
import { scriptStatesHandler } from './utils/scriptStatesHandler';

export const BLOCKS: READONLY_BLOCK[] = [
  { id: 0, contents: ['もし▶ボタンが押されたなら'] },
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
  scriptState: ScriptState,
  nestCount: number,
  setState: Dispatch<SetStateAction<SpriteState>>,
): Record<number, () => void> => {
  const {
    setStepDelay,
    addNestToStepCount,
    deleteNestFromStepCount,
    resetStepCount,
    addNestToLoopCount,
    deleteNestFromLoopCount,
    addLoopCount,
    addNestToStatus,
    deleteNestFromNestStatus,
    updateNestedStatus,
  } = scriptStatesHandler;
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
      addNestToStepCount(scriptState, newNestCount);
      addNestToLoopCount(scriptState, newNestCount);
      addNestToStatus(scriptState, newNestCount, arg(0) === 'true');
      const innerScripts = args[1];
      if (!(innerScripts instanceof Array)) {
        throw new Error('Invalid innerScripts');
      }
      if (scriptState.nestStatus[newNestCount]) {
        moves(
          fn,
          innerScripts[scriptState.stepCount[newNestCount]].arg,
          scriptState,
          newNestCount,
          setState,
        )[innerScripts[scriptState.stepCount[newNestCount]].id]?.();
      }
      if (scriptState.loopCount.length - 1 !== newNestCount) {
        return;
      }
      if (scriptState.stepCount[newNestCount] >= innerScripts.length - 1) {
        deleteNestFromLoopCount(scriptState);
        deleteNestFromStepCount(scriptState);
        deleteNestFromNestStatus(scriptState);
        setStepDelay(scriptState, 0);
      }
    },
    // eslint-disable-next-line complexity
    7: () => {
      const newNestCount = nestCount + 1;
      addNestToStepCount(scriptState, newNestCount);
      addNestToLoopCount(scriptState, newNestCount);
      addNestToStatus(
        scriptState,
        newNestCount,
        scriptState.loopCount[scriptState.loopCount.length - 1] < Number(arg(0)),
      );
      const innerScripts = args[1];
      if (!(innerScripts instanceof Array)) {
        throw new Error('Invalid innerScripts');
      }
      if (scriptState.nestStatus[scriptState.nestStatus.length - 1]) {
        moves(
          fn,
          innerScripts[scriptState.stepCount[newNestCount]].arg,
          scriptState,
          newNestCount,
          setState,
        )[innerScripts[scriptState.stepCount[newNestCount]].id]?.();
      }
      if (scriptState.loopCount.length - 1 !== newNestCount) {
        return;
      }
      if (scriptState.loopCount[scriptState.loopCount.length - 1] >= Number(arg(0)) - 1) {
        deleteNestFromLoopCount(scriptState);
        deleteNestFromStepCount(scriptState);
        deleteNestFromNestStatus(scriptState);
        setStepDelay(scriptState, 0);
        return;
      }
      if (scriptState.stepCount[newNestCount] >= innerScripts.length - 1) {
        resetStepCount(scriptState);
        addLoopCount(scriptState);
      }
    },
    // eslint-disable-next-line complexity
    8: () => {
      const newNestCount = nestCount + 1;
      addNestToStepCount(scriptState, newNestCount);
      addNestToLoopCount(scriptState, newNestCount);
      addNestToStatus(scriptState, newNestCount, arg(0) === 'true');
      const innerScripts = args[1];
      if (!(innerScripts instanceof Array)) {
        throw new Error('Invalid innerScripts');
      }
      if (scriptState.nestStatus[newNestCount]) {
        moves(
          fn,
          innerScripts[scriptState.stepCount[newNestCount]].arg,
          scriptState,
          newNestCount,
          setState,
        )[innerScripts[scriptState.stepCount[newNestCount]].id]?.();
      }
      if (scriptState.loopCount.length - 1 !== newNestCount) {
        return;
      }
      if (!scriptState.nestStatus[newNestCount]) {
        deleteNestFromLoopCount(scriptState);
        deleteNestFromStepCount(scriptState);
        deleteNestFromNestStatus(scriptState);
        setStepDelay(scriptState, 0);
        return;
      }
      if (scriptState.stepCount[newNestCount] >= innerScripts.length - 1) {
        resetStepCount(scriptState);
        addLoopCount(scriptState);
        updateNestedStatus(scriptState, newNestCount, arg(0) === 'true');
      }
    },
  };
};
