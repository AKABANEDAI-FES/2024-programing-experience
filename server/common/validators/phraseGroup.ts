import { z } from 'zod';

export const categoryValidator = z.enum(['BEFORE_QUEST', 'AFTER_QUEST_OK', 'AFTER_QUEST_FAIL']);
export type Category = z.infer<typeof categoryValidator>;
