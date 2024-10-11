import { isArg } from './isArg';

export const computeArgIndex = (contents: (string | [])[], endIndex: number) =>
  contents.slice(0, endIndex).filter(isArg).length;
