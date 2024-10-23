import type { DtoId, MaybeId } from './brandedId';
import type { NonNullableObj, StrictOmit } from './index';
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
  author: { id: DtoId['user']; signInName: string };
};

export type QuestCreateOrUpdateVal = {
  name: string;
  
  description: string;
  image?: Blob;
  exampleAnswer: Scripts[];
};

export type QuestUpdateDto = StrictOmit<QuestDto, 'id' | 'author' | 'createdAt' | 'updatedAt'> &
  NonNullableObj<Pick<QuestDto, 'updatedAt'>> & {
    questId: MaybeId['quest'];
  };

export type QuestUpdateIndexVal = { questId: MaybeId['quest']; indexInGroup: number };
