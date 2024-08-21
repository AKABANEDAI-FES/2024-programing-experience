export type Block = { id: number; arg: (Block | string)[] };
export type BLOCK = { id: number; contents: string[] };

export type SpriteState = {
  x: number;
  y: number;
  direction: number;
};
