import type { BLOCK } from '../types';
import { isArg } from './isArg';

export const defaultBlock = ({ id, contents }: BLOCK) => ({
  id,
  arg: contents.filter(isArg).map((a) => (a instanceof Array ? a : a.replace('$', ''))),
});
