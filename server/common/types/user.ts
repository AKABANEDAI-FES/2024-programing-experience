import type { DtoId } from './brandedId';

export type UserDto = {
  id: DtoId['user'];
  signInName: string;
  displayName: string;
  email: string;
  isAdmin: boolean;
  language: 'KANJI' | 'HIRAGANA' | 'ENGLISH';
  createdTime: number;
  photoUrl: string | undefined;
};
