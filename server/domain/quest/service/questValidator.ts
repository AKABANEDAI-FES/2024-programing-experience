import type { Block, blockArg, Scripts } from 'common/types/playground';
import { z } from 'zod';

const blockValidator: z.ZodSchema<Block> = z.lazy(() =>
  z.object({
    id: z.number(),
    arg: z.array(blockArgValidator),
  }),
) satisfies z.ZodType<Block>;

const blockArgValidator: z.ZodSchema<blockArg> = z.union([
  z.array(blockValidator),
  blockValidator,
  z.string(),
]) satisfies z.ZodType<blockArg>;

export const scriptsValidator = z.array(
  z.object({
    script: z.array(blockValidator),
    position: z.object({
      x: z.number(),
      y: z.number(),
    }),
  }),
) satisfies z.ZodType<Scripts>;
