import type { LanguageEnum } from '@prisma/client';
import type { DtoId } from './brandedId';

export type UserDto = {
  id: DtoId['user'];
  signInName: string;
  displayName: string;
  email: string;
  isAdmin: boolean;
  language: LanguageEnum;
  createdTime: number;
  photoUrl: string | undefined;
};
