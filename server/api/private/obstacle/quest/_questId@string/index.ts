import type { DefineMethods } from 'aspida';
import type { ObstacleCreateVal, ObstacleDto } from 'common/types/obstacle';

export type Methods = DefineMethods<{
  post: {
    reqFormat: FormData;
    reqBody: ObstacleCreateVal;
    resBody: ObstacleDto;
  };
}>;
