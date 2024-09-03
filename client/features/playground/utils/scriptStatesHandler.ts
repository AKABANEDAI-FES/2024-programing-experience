import type { ScriptState } from '../types';

export const scriptStatesHandler = {
  setStepDelay: (scriptState: ScriptState, newDelay: number | null) => {
    scriptState.stepDelay = newDelay;
  },
  addNestToStepCount: (scriptState: ScriptState, nestCount: number) => {
    if (scriptState.stepCount.length > nestCount) {
      return;
    }
    scriptState.stepCount.push(0);
  },
  deleteNestFromStepCount: (scriptState: ScriptState) => {
    scriptState.stepCount.pop();
  },
  resetStepCount: (scriptState: ScriptState) => {
    scriptState.stepCount[scriptState.stepCount.length - 1] = -1;
  },
  addNestToLoopCount: (scriptState: ScriptState, nestCount: number) => {
    if (scriptState.loopCount.length > nestCount) {
      return;
    }
    scriptState.loopCount.push(0);
  },
  deleteNestFromLoopCount: (scriptState: ScriptState) => {
    scriptState.loopCount.pop();
  },
  addLoopCount: (scriptState: ScriptState) => {
    scriptState.loopCount[scriptState.loopCount.length - 1] += 1;
  },
  addNestToStatus: (scriptState: ScriptState, nestCount: number, status: boolean) => {
    if (scriptState.nestStatus.length > nestCount) {
      return;
    }
    scriptState.nestStatus.push(status);
  },
  deleteNestFromNestStatus: (scriptState: ScriptState) => {
    scriptState.nestStatus.pop();
  },
  updateNestedStatus: (scriptState: ScriptState, nestCount: number, status: boolean) => {
    scriptState.nestStatus[scriptState.nestStatus.length - 1] = status;
  },
};
