import type { DefineMethods } from 'aspida';
import type { ObstacleDto } from 'common/types/obstacle';

export type Methods = DefineMethods<{
  delete: {
    resBody: ObstacleDto;
  };
}>;
