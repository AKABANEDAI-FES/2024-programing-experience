import type { Dispatch, SetStateAction } from 'react';
import type { Block, BLOCK, SpriteState } from './types';

export const BLOCKS: BLOCK[] = [
  { id: 1, contents: ['前へ', '$10', '歩進む'] },
  { id: 2, contents: ['右へ', '$10', '度回る'] },
  { id: 3, contents: ['左へ', '$10', '度回る'] },
  { id: 5, contents: ['後ろへ', '$10', '歩戻る'] },
  { id: 4, contents: ['$10', '秒待つ'] },
];

export const BLOCKS_DICT = BLOCKS.reduce(
  (prev, curr) => {
    prev[curr.id] = curr;
    return prev;
  },
  {} as Record<number, BLOCK>,
);

export const moves = (
  fn: (arg: Block | string) => void | string | undefined,
  args: (Block | string)[],
  setState: Dispatch<SetStateAction<SpriteState>>,
  setStepDelay: Dispatch<SetStateAction<number | null>>,
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
  };
};
