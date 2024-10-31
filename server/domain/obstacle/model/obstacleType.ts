import type { MultipartFile } from '@fastify/multipart';
import type { StrictOmit } from 'common/types';
import type { ObstacleDto } from 'common/types/obstacle';
import type { EntityId } from 'service/brandedId';
import type { S3PutParams } from 'service/s3Client';

export type ObstacleEntity = StrictOmit<ObstacleDto, 'id' | 'image' | 'questId'> & {
  id: EntityId['obstacle'];
  imageKey: string | undefined;
  questId: EntityId['quest'];
};

export type ObstacleCreateServerVal = StrictOmit<ObstacleDto, 'id' | 'image'> & {
  image?: MultipartFile;
};

export type ObstacleSaveVal = {
  obstacle: ObstacleEntity;
  s3Params?: S3PutParams;
};

export type ObstacleDeleteVal = { deletable: boolean; obstacle: ObstacleEntity };
