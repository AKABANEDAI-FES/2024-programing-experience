import type { Phrase, Prisma } from '@prisma/client';
import { brandedId } from 'service/brandedId';
import { depend } from 'velona';
import type { PhraseEntity } from '../model/phraseType';

const toPhraseEntity = (prismaPhrase: Phrase): PhraseEntity => ({
  id: brandedId.phrase.entity.parse(prismaPhrase.id),
  phrase: prismaPhrase.phrase,
  indexInGroup: prismaPhrase.indexInGroup,
  phraseGroupId: brandedId.phraseGroup.entity.parse(prismaPhrase.phraseGroupId),
});

const listByGroupId = async (
  tx: Prisma.TransactionClient,
  phraseGroupId: string,
): Promise<PhraseEntity[]> => {
  const phrases = await tx.phrase.findMany({
    where: { phraseGroupId },
    orderBy: { indexInGroup: 'asc' },
  });
  return phrases.map(toPhraseEntity);
};

export const phraseQuery = {
  listByGroupId,
  findById: async (tx: Prisma.TransactionClient, phraseId: string): Promise<PhraseEntity> => {
    const phrase = await tx.phrase.findUniqueOrThrow({
      where: { id: phraseId },
    });
    return toPhraseEntity(phrase);
  },
  listByGroupIdWithDI: depend(
    { listByGroupId },
    (deps, tx: Prisma.TransactionClient, phraseGroupId: string): Promise<PhraseEntity[]> =>
      deps.listByGroupId(tx, phraseGroupId),
  ),
};
