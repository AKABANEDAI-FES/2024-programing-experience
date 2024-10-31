import type { StrictOmit, SubKeyObj } from '.';
import type { DtoId } from './brandedId';

export type ObstacleDto = {
  id: DtoId['obstacle'];
  name: string;
  type: number;
  image: { url: string; s3Key: string } | undefined;
  questId: DtoId['quest'];
};

export type ObstacleCreateVal = StrictOmit<ObstacleDto, 'id' | 'image' | 'questId'> &
  SubKeyObj<
    ObstacleDto,
    {
      image?: Blob;
    }
  >;
