import type { Block, blockArg } from 'common/types/playground';
import { BLOCKS_DICT } from '../constants';
import { isArg } from './isArg';

const handleArg = (arg: blockArg, indexes: number[]): [blockArg, Exclude<blockArg, string>] => {
  if (typeof arg === 'string') {
    throw new Error('Invalid arg');
  }
  if (arg instanceof Array) {
    return sliceScripts(arg, indexes);
  }
  return deleteArg(arg, indexes);
};

const deleteArg = (script: Block, indexes: number[]): [Block, Exclude<blockArg, string>] => {
  const newIndexes = [...indexes];
  const index = newIndexes.shift();
  if (index === undefined) {
    throw new Error('Invalid index');
  }
  const id = script.id;
  if (newIndexes.length === 0) {
    const newTarget = script.arg[index];
    if (typeof newTarget === 'string') {
      throw new Error('Invalid target');
    }
    return [
      {
        id,
        arg: script.arg.map((a, i) =>
          i === index ? BLOCKS_DICT[id].contents.filter(isArg)[index] : a,
        ),
      },
      newTarget,
    ];
  }

  const [newArg, newTarget] = handleArg(script.arg[index], newIndexes);
  return [
    {
      id,
      arg: script.arg.map((a, i) => (i === index ? newArg : a)),
    },
    newTarget,
  ];
};

const sliceScripts = (
  scripts: Block[],
  indexes: number[],
): [Block[], Exclude<blockArg, string>] => {
  const newIndexes = [...indexes];
  const index = newIndexes.shift();
  if (index === undefined) {
    throw new Error('Invalid index');
  }
  if (newIndexes.length === 0) {
    const scriptsLength = scripts.length;
    return [scripts.slice(0, -(index + 1)), scripts.slice(-(index + 1), scriptsLength)];
  }
  const [newArg, newTarget] = deleteArg(scripts[index], newIndexes);
  return [scripts.map((s, i) => (i === index ? newArg : s)), newTarget];
};

export const deleteScript = (
  script: Block[],
  indexes: number[],
): [Block[], Exclude<blockArg, string>] => {
  const deletedScript = sliceScripts(script, indexes);
  return deletedScript;
};
