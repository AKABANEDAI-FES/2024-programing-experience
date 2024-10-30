import type { MultipartFile } from '@fastify/multipart';
import type { StrictOmit, SubKeyObj } from 'common/types';
import type { MaybeId } from 'common/types/brandedId';
import type { PhraseGroupDto } from 'common/types/phraseGroup';
import type { EntityId } from 'service/brandedId';
import type { S3PutParams } from 'service/s3Client';
import type { PhraseEntity } from './phraseType';

export type PhraseGroupEntity = StrictOmit<PhraseGroupDto, 'id' | 'Quest' | 'backgroundImage'> &
  SubKeyObj<
    PhraseGroupDto,
    {
      id: EntityId['phraseGroup'];
      Phrases: PhraseEntity[];
      backgroundImageKey: string | undefined;
      quest: { id: EntityId['quest']; name: string };
    }
  >;
export type PhraseGroupCreateServerVal = StrictOmit<
  PhraseGroupDto,
  'id' | 'backgroundImage' | 'Quest'
> &
  SubKeyObj<
    PhraseGroupDto,
    {
      backgroundImage?: MultipartFile;
    }
  >;

export type PhraseGroupCreateVal = StrictOmit<PhraseGroupDto, 'id' | 'backgroundImage' | 'Quest'> &
  SubKeyObj<PhraseGroupDto, { backgroundImage?: MultipartFile }> & {
    questId: MaybeId['quest'];
  };
export type PhraseGroupUpdateVal = StrictOmit<PhraseGroupDto, 'id' | 'backgroundImage' | 'Quest'> &
  SubKeyObj<PhraseGroupDto, { id: MaybeId['phraseGroup']; backgroundImage?: MultipartFile }>;

export type PhraseGroupSaveVal = {
  phraseGroup: PhraseGroupEntity;
  s3Params?: S3PutParams;
};
