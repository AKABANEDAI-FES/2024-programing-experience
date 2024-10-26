import type { DtoId, MaybeId } from './brandedId';
import type { StrictOmit, SubKeyObj } from './index';
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
> &
  SubKeyObj<
    QuestDto,
    {
      backgroundImage?: Blob;
      exampleAnswer: string;
    }
  > & { questGroupId: MaybeId['questGroup'] };

export type QuestUpdateVal = StrictOmit<
  QuestDto,
  'id' | 'Author' | 'createdAt' | 'updatedAt' | 'indexInGroup' | 'backgroundImage' | 'exampleAnswer'
> &
  SubKeyObj<
    QuestDto,
    {
      backgroundImage?: Blob;
      id: MaybeId['quest'];
      exampleAnswer: string;
    }
  >;

export type QuestUpdateIndexVal = { questId: MaybeId['quest']; indexInGroup: number };
