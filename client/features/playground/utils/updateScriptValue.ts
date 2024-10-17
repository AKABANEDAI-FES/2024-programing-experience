import type { Block, blockArg } from '../types';

// eslint-disable-next-line complexity
export const updateScriptValue = (
  arg: Exclude<blockArg, Block[]>,
  script: Exclude<blockArg, string>,
  indexes: number[],
) => {
  const newIndexes = [...indexes];
  const index = newIndexes.shift();
  if (index === undefined) {
    throw new Error('Invalid index');
  }
  if (script instanceof Array) {
    if (script[index] === undefined) {
      // eslint-disable-next-line max-depth
      if (typeof arg === 'string') {
        throw new Error('Invalid arg');
      }
      // eslint-disable-next-line max-depth
      if (index === -1) {
        script.unshift(arg);
      } else {
        script.push(arg);
      }
      return;
    }
    if (newIndexes.length <= 0) {
      // eslint-disable-next-line max-depth
      if (typeof arg === 'string') {
        throw new Error('Invalid arg');
      }
      script.splice(index + 1, 0, arg);
      return;
    }
    updateScriptValue(arg, script[index], newIndexes);
    return;
  }
  if (newIndexes.length <= 0) {
    script.arg[index] = arg ?? '';
    return;
  }
  if (typeof script.arg[index] === 'string') {
    throw new Error('Invalid indexes');
  }
  updateScriptValue(arg, script.arg[index], newIndexes);
  return;
};
