import type { DtoId, MaybeId } from './brandedId';
import type { StrictOmit } from './index';
import type { Scripts } from './playground';

export type QuestDto = {
  id: DtoId['quest'];
  name: string;
  description: string;
  backgroundImage: { url: string; s3Key: string } | undefined;
  exampleAnswer: Scripts;
  createdAt: number;
  updatedAt: number | undefined;
  indexInGroup: number;
  Author: { id: DtoId['user']; signInName: string };
};

export type QuestCreateVal = StrictOmit<
  QuestDto,
  'id' | 'Author' | 'createdAt' | 'updatedAt' | 'backgroundImage' | 'exampleAnswer'
> & {
  backgroundImage?: Blob;
  questGroupId: MaybeId['questGroup'];
  exampleAnswer: string;
};

export type QuestUpdateVal = StrictOmit<
  QuestDto,
  'id' | 'Author' | 'createdAt' | 'updatedAt' | 'indexInGroup' | 'backgroundImage' | 'exampleAnswer'
> & {
  backgroundImage?: Blob;
  id: MaybeId['quest'];
  exampleAnswer: string;
};

export type QuestUpdateIndexVal = { questId: MaybeId['quest']; indexInGroup: number };
