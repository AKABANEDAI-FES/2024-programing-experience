/* eslint-disable complexity */
import type { Dispatch, SetStateAction } from 'react';
import { moves } from '../constants';
import type { blockArg, BlockT, ScriptState, SpriteState } from '../types';
import {
  addNestToLoopCount,
  addNestToStatus,
  addNestToStepCount,
  deleteNestFromLoopCount,
  deleteNestFromNestStatus,
  deleteNestFromStepCount,
  setStepDelay,
} from './scriptStatesHandler';

export const nestedStepMoveBase = (
  fn: (arg: blockArg) => void | string | undefined,
  scriptState: ScriptState,
  status: () => boolean,
  nestCount: number,
  innerScripts: BlockT[],
  isDeleteNest: () => boolean,
  setState: Dispatch<SetStateAction<SpriteState>>,
  afterFn?: () => void,
) => {
  if (scriptState.nestStatus.length <= nestCount) {
    addNestToStepCount(scriptState);
    addNestToLoopCount(scriptState);
    addNestToStatus(scriptState, status());
  }

  if (isDeleteNest()) {
    deleteNestFromLoopCount(scriptState);
    deleteNestFromStepCount(scriptState);
    deleteNestFromNestStatus(scriptState);
    setStepDelay(scriptState, 0);
    return;
  }

  if (scriptState.nestStatus[nestCount]) {
    moves(
      fn,
      innerScripts[scriptState.stepCount[nestCount]]?.arg,
      scriptState,
      nestCount,
      setState,
    )[innerScripts[scriptState.stepCount[nestCount]]?.id]?.();
  } else {
    setStepDelay(scriptState, 0);
  }

  if (scriptState.nestStatus.length - 1 !== nestCount) {
    return;
  }

  afterFn?.();
};
