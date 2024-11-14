import type {
  Block as CommonBlock,
  blockArg as CommonBlockArg,
  Scripts as CommonScripts,
} from 'common/types/playground';
export type blockArg = CommonBlockArg;

export type BlockT = CommonBlock;
export type BLOCK = { id: number; contents: (string | [])[] };

export type READONLY_BLOCK = Readonly<{ [T in keyof BLOCK]: Readonly<BLOCK[T]> }>;

export type SpriteState = {
  x: number;
  y: number;
  direction: number;
};

export type ScriptState = {
  script: BlockT[];
  active: boolean;
  stepDelay: number | null;
  stepCount: number[];
  loopCount: number[];
  nestStatus: boolean[];
};

export type Scripts = CommonScripts;
export type Rect = {
  left: number;
  top: number;
  size: number;
};
