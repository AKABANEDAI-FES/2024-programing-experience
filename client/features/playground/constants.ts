import type { Dispatch, SetStateAction } from 'react';
import type { Block, BLOCK, READONLY_BLOCK, SpriteState } from './types';

export const BLOCKS: READONLY_BLOCK[] = [
  { id: 1, contents: ['前へ', '$10', '歩進む'] },
  { id: 2, contents: ['右へ', '$10', '度回る'] },
  { id: 3, contents: ['左へ', '$10', '度回る'] },
  { id: 5, contents: ['後ろへ', '$10', '歩戻る'] },
  { id: 4, contents: ['$10', '秒待つ'] },
];

const emptyBlockDict: Record<number, BLOCK> = {};

export const BLOCKS_DICT = BLOCKS.reduce((prev, curr) => {
  // @ts-expect-error TS2322
  prev[curr.id] = curr;
  return prev;
}, emptyBlockDict);

export const moves = (
  fn: (arg: Block | string) => void | string | undefined,
  args: (Block | string)[],
  setState: Dispatch<SetStateAction<SpriteState>>,
  setStepDelay: Dispatch<SetStateAction<number | null>>,
): Record<number, () => void> => {
  // console.log('moves');
  // console.log(fn);
  // console.log(args);
  const arg = (n: number) => fn(args[n]);
  setStepDelay(null);
  return {
    1: () => {
      // console.log('move', 1);
      // console.log('arg(0)', arg(0));
      setState((prev) => ({
        ...prev,
        x: prev.x + Number(arg(0)) * Math.cos((prev.direction / 180) * Math.PI),
        y: prev.y + Number(arg(0)) * Math.sin((prev.direction / 180) * Math.PI),
      }));
      // console.log('move end', 1);
    },
    2: () => {
      // console.log('move', 2);
      setState((prev) => ({
        ...prev,
        direction: prev.direction + Number(arg(0)),
      }));
      // console.log('move end', 2);
    },
    3: () => {
      // console.log('move', 3);
      setState((prev) => ({
        ...prev,
        direction: prev.direction - Number(arg(0)),
      }));
      // console.log('move end', 3);
    },
    4: () => {
      // console.log('move', 4);
      setStepDelay(Number(arg(0)));
      // console.log('move end', 4);
    },
    5: () => {
      // console.log('move', 5);
      setState((prev) => ({
        ...prev,
        x: prev.x - Number(arg(0)) * Math.cos((prev.direction / 180) * Math.PI),
        y: prev.y - Number(arg(0)) * Math.sin((prev.direction / 180) * Math.PI),
      }));
      // console.log('move end', 5);
    },
  };
};
