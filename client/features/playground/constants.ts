import type { BLOCK } from './types';

export const BLOCKS: BLOCK[] = [
  { id: 1, contents: ['前へ', '$number', '歩進む'] },
  { id: 2, contents: ['右へ', '$number', '度回る'] },
  { id: 3, contents: ['左へ', '$number', '度回る'] },
  { id: 5, contents: ['後ろへ', '$number', '歩戻る'] },
  { id: 4, contents: ['$number', '秒待つ'] },
];

export const BLOCKS_DICT = BLOCKS.reduce(
  (prev, curr) => {
    prev[curr.id] = curr;
    return prev;
  },
  {} as Record<number, BLOCK>,
);
