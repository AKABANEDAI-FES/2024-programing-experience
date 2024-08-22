export type Block = { id: number; arg: (Block | string)[] };
export type BLOCK = { id: number; contents: string[] };

export type READONLY_BLOCK = Readonly<{ [T in keyof BLOCK]: Readonly<BLOCK[T]> }>;

export type SpriteState = {
  x: number;
  y: number;
  direction: number;
};
