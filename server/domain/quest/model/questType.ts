import type { MultipartFile } from '@fastify/multipart';
import type { NonNullableObj, StrictOmit } from 'common/types';
import type { QuestDto, QuestUpdateDto } from 'common/types/quest';
import type { EntityId } from 'service/brandedId';
import type { S3PutParams } from 'service/s3Client';

export type QuestEntity = StrictOmit<QuestDto, 'id' | 'backgroundImage' | 'author'> & {
  id: EntityId['quest'];
  imageKey: string | undefined;
  author: StrictOmit<QuestDto['author'], 'id'> & { id: EntityId['user'] };
};

export type QuestCreateServerVal = {
  quest: StrictOmit<QuestDto, 'id' | 'backgroundImage' | 'createdAt' | 'author'> & {
    backgroundImage?: MultipartFile;
  };
  questGroupId: EntityId['questGroup'];
};

export type QuestUpdateServerVal = StrictOmit<QuestUpdateDto, 'backgroundImage'> & {
  backgroundImage?: MultipartFile;
};

export type QuestCreateVal = {
  quest: QuestEntity;
  s3Params?: S3PutParams;
  questGroupId: EntityId['questGroup'];
};

export type QuestUpdateVal = {
  quest: StrictOmit<QuestEntity, 'updatedAt' | 'author' | 'createdAt'> &
    NonNullableObj<Pick<QuestEntity, 'updatedAt'>>;
  s3Params?: S3PutParams;
};

export type QuestCreateEntityVal = {
  quests: QuestEntity[];
  s3Params?: S3PutParams;
};
export type QuestUpdateEntityVal = {
  quest: StrictOmit<QuestEntity, 'updatedAt'> & NonNullableObj<Pick<QuestEntity, 'updatedAt'>>;
  s3Params?: S3PutParams;
};

export type QuestDeleteVal = { deletable: boolean; quest: QuestEntity };
