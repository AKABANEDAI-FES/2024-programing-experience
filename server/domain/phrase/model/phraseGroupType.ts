import type { MultipartFile } from '@fastify/multipart';
import type { StrictOmit, SubKeyObj } from 'common/types';
import type { PhraseGroupDto } from 'common/types/phraseGroup';
import type { EntityId } from 'service/brandedId';
import type { PhraseEntity } from './phraseType';

export type PhraseGroupEntity = StrictOmit<PhraseGroupDto, 'id' | 'Quest' | 'backgroundImage'> &
  SubKeyObj<
    PhraseGroupDto,
    { id: EntityId['phraseGroup']; Phrases: PhraseEntity[]; backgroundImage?: Blob }
  >;

export type PhraseGroupCreateServerVal = StrictOmit<
  PhraseGroupDto,
  'id' | 'Quest' | 'backgroundImage'
> &
  SubKeyObj<PhraseGroupDto, { backgroundImage?: MultipartFile }>;
