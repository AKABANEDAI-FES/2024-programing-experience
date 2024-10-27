import type { Phrase, Prisma } from '@prisma/client';
import { brandedId } from 'service/brandedId';
import type { PhraseEntity } from '../model/phraseType';

const toPhraseEntity = (prismaPhrase: Phrase): PhraseEntity => ({
  id: brandedId.phrase.entity.parse(prismaPhrase.id),
  phrase: prismaPhrase.phrase,
  indexInGroup: prismaPhrase.indexInGroup,
  phraseGroupId: brandedId.phraseGroup.entity.parse(prismaPhrase.phraseGroupId),
});

export const phraseQuery = {
  findById: async (tx: Prisma.TransactionClient, phraseId: string): Promise<PhraseEntity> => {
    const phrase = await tx.phrase.findUniqueOrThrow({
      where: { id: phraseId },
    });
    return toPhraseEntity(phrase);
  },
};
