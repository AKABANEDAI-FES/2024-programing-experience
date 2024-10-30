import type { MultipartFile } from '@fastify/multipart';
import type { StrictOmit, SubKeyObj } from 'common/types';
import type { CharacterDto } from 'common/types/character';
import type { EntityId } from 'service/brandedId';
import type { S3PutParams } from 'service/s3Client';

export type CharacterEntity = StrictOmit<CharacterDto, 'id' | 'image' | 'questId'> &
  SubKeyObj<
    CharacterDto,
    {
      id: EntityId['character'];
      imageKey: string | undefined;
      questId: EntityId['quest'];
    }
  >;

export type CharacterCreateServerVal = StrictOmit<CharacterDto, 'id' | 'image'> &
  SubKeyObj<
    CharacterDto,
    {
      image?: MultipartFile;
    }
  >;

export type CharacterUpdateServerVal = StrictOmit<CharacterDto, 'image'> &
  SubKeyObj<
    CharacterDto,
    {
      image?: MultipartFile;
    }
  >;

export type CharacterSaveVal = { character: CharacterEntity; s3Params?: S3PutParams };
