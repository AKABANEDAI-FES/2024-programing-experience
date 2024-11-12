import type { blockArg } from '../types';

// eslint-disable-next-line complexity
export const updateScriptValue = (
  arg: blockArg,
  script: Exclude<blockArg, string>,
  indexes: number[],
) => {
  const newIndexes = [...indexes];
  const index = newIndexes.shift();
  if (index === undefined) {
    throw new Error('Invalid index');
  }
  if (script instanceof Array) {
    if (typeof arg !== 'string') {
      const wrappedArg = [arg].flat(1);
      // eslint-disable-next-line max-depth
      if (script[index] === undefined) {
        // eslint-disable-next-line max-depth
        if (index === -1) {
          script.unshift(...wrappedArg);
        } else {
          script.push(...wrappedArg);
        }
        return;
      }
      // eslint-disable-next-line max-depth
      if (newIndexes.length <= 0) {
        script.splice(index + 1, 0, ...wrappedArg);
        return;
      }
    }
    updateScriptValue(arg, script[index], newIndexes);
    return;
  }
  if (newIndexes.length <= 0) {
    script.arg[index] = arg ?? '';
    return;
  }
  const scriptArg = script.arg[index];
  if (typeof scriptArg === 'string') {
    throw new Error('Invalid indexes');
  }
  updateScriptValue(arg, scriptArg, newIndexes);
  return;
};
