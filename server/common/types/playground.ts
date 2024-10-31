export type blockArg = Block[] | Block | string;

export type Block = { id: number; arg: blockArg[] };

export type Scripts = {
  script: Block[];
  position: { x: number; y: number };
}[];
