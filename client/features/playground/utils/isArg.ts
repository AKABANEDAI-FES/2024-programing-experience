import type { BLOCK } from '../types';
export const isArg = (content: BLOCK['contents'][number]) =>
  content instanceof Array || content.startsWith('$');
