import type { ScriptState } from '../types';

export const setStepDelay = (scriptState: ScriptState, newDelay: number | null) => {
  scriptState.stepDelay = newDelay;
};
export const addNestToStepCount = (scriptState: ScriptState) => {
  scriptState.stepCount.push(0);
};
export const deleteNestFromStepCount = (scriptState: ScriptState) => {
  scriptState.stepCount.pop();
};
export const resetStepCount = (scriptState: ScriptState, nestCount: number) => {
  scriptState.stepCount[nestCount] = -1;
};
export const addNestToLoopCount = (scriptState: ScriptState) => {
  scriptState.loopCount.push(0);
};
export const deleteNestFromLoopCount = (scriptState: ScriptState) => {
  scriptState.loopCount.pop();
};
export const addLoopCount = (scriptState: ScriptState, nestCount: number) => {
  scriptState.loopCount[nestCount] += 1;
};
export const addNestToStatus = (scriptState: ScriptState, status: boolean) => {
  scriptState.nestStatus.push(status);
};
export const deleteNestFromNestStatus = (scriptState: ScriptState) => {
  scriptState.nestStatus.pop();
};
export const updateNestedStatus = (
  scriptState: ScriptState,
  nestCount: number,
  status: boolean,
) => {
  scriptState.nestStatus[nestCount] = status;
};
