import type { ScriptState } from '../types';

export const scriptStatesHandler = {
  setStepDelay: (scriptState: ScriptState, newDelay: number | null) => {
    scriptState.stepDelay = newDelay;
  },
  addNestToStepCount: (scriptState: ScriptState) => {
    scriptState.stepCount.push(0);
  },
  deleteNestFromStepCount: (scriptState: ScriptState) => {
    scriptState.stepCount.pop();
  },
  resetStepCount: (scriptState: ScriptState, nestCount: number) => {
    scriptState.stepCount[nestCount] = -1;
  },
  addNestToLoopCount: (scriptState: ScriptState) => {
    scriptState.loopCount.push(0);
  },
  deleteNestFromLoopCount: (scriptState: ScriptState) => {
    scriptState.loopCount.pop();
  },
  addLoopCount: (scriptState: ScriptState, nestCount: number) => {
    scriptState.loopCount[nestCount] += 1;
  },
  addNestToStatus: (scriptState: ScriptState, status: boolean) => {
    scriptState.nestStatus.push(status);
  },
  deleteNestFromNestStatus: (scriptState: ScriptState) => {
    scriptState.nestStatus.pop();
  },
  updateNestedStatus: (scriptState: ScriptState, nestCount: number, status: boolean) => {
    scriptState.nestStatus[nestCount] = status;
  },
};
