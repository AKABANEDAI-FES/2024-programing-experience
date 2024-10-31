import type { MultipartFile } from '@fastify/multipart';
import type { NonNullableObj, StrictOmit, SubKeyObj } from 'common/types';
import type { MaybeId } from 'common/types/brandedId';
import type { QuestDto } from 'common/types/quest';
import type { CharacterEntity } from 'domain/character/model/characterType';
import type { ObstacleEntity } from 'domain/obstacle/model/obstacleType';
import type { PhraseGroupEntity } from 'domain/phrase/model/phraseGroupType';
import type { EntityId } from 'service/brandedId';
import type { S3PutParams } from 'service/s3Client';

export type QuestEntity = StrictOmit<QuestDto, 'id' | 'backgroundImage' | 'Author'> & {
  id: EntityId['quest'];
  imageKey: string | undefined;
  Author: StrictOmit<QuestDto['Author'], 'id'> &
    SubKeyObj<QuestDto['Author'], { id: EntityId['user'] }>;
};

export type QuestBigEntity = QuestEntity & {
  phraseGroups: StrictOmit<PhraseGroupEntity, 'quest'>[];
  characters: CharacterEntity[];
  obstacles: ObstacleEntity[];
};

export type QuestCreateServerVal = StrictOmit<
  QuestDto,
  'id' | 'backgroundImage' | 'createdAt' | 'Author' | 'updatedAt'
> &
  SubKeyObj<
    QuestDto,
    {
      backgroundImage?: MultipartFile;
      questGroupId: MaybeId['questGroup'];
    }
  >;

export type QuestUpdateServerVal = StrictOmit<
  QuestDto,
  'id' | 'Author' | 'createdAt' | 'updatedAt' | 'indexInGroup' | 'backgroundImage'
> &
  SubKeyObj<
    QuestDto,
    {
      backgroundImage?: MultipartFile;
      id: MaybeId['quest'];
    }
  >;

export type QuestCreateVal = {
  quest: QuestEntity;
  s3Params?: S3PutParams;
  questGroupId: EntityId['questGroup'];
};

export type QuestUpdateVal = {
  quest: StrictOmit<QuestEntity, 'updatedAt' | 'Author' | 'createdAt'> &
    NonNullableObj<Pick<QuestEntity, 'updatedAt'>>;
  s3Params?: S3PutParams;
};

export type QuestCreateEntityVal = StrictOmit<QuestCreateVal, 'questGroupId'>;

export type QuestUpdateEntityVal = {
  quest: StrictOmit<QuestEntity, 'updatedAt'> & NonNullableObj<Pick<QuestEntity, 'updatedAt'>>;
  s3Params?: S3PutParams;
};

export type QuestDeleteVal = {
  deletable: boolean;
  quest: QuestEntity;
  questGroupId?: EntityId['questGroup'];
};
