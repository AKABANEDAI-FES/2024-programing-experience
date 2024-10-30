import type { StrictOmit, SubKeyObj } from '.';
import type { DtoId } from './brandedId';

export type CharacterDto = {
  id: DtoId['character'];
  name: string;
  description: string;
  image: { url: string; s3Key: string } | undefined;
  questId: DtoId['quest'];
};

export type CharacterCreateVal = StrictOmit<CharacterDto, 'id' | 'image'> &
  SubKeyObj<
    CharacterDto,
    {
      image?: Blob;
    }
  >;

export type CharacterUpdateVal = StrictOmit<CharacterDto, 'image'> &
  SubKeyObj<CharacterDto, { image?: Blob }>;
