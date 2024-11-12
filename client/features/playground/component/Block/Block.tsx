import type { Block as BlockT } from 'common/types/playground';
import type { Props as RootProps } from 'features/playground/component/ScriptRoot/ScriptRoot';
import { BLOCKS_DICT } from 'features/playground/constants';
import { computeArgIndex } from 'features/playground/utils/computeArgIndex';
import { isArg } from 'features/playground/utils/isArg';
import { lambda } from 'utils/lambda';
import { ScriptRoot } from '../ScriptRoot/ScriptRoot';
import styles from '../ScriptRoot/ScriptRoot.module.css';

const blockClassHandler = (isNotShadow: boolean) =>
  isNotShadow ? styles.block : styles.blockShadow;
const blockDirectionHandler = (isArray: boolean) =>
  isArray ? styles.blockColumn : styles.blockRow;

type Props = {
  arg: BlockT;
  indexes: number[];
  isNotShadow: boolean;
  props: RootProps;
  dragOverChildElement: () => void;
};

export const Block = ({ arg, indexes, isNotShadow, props, dragOverChildElement }: Props) => (
  <div className={blockClassHandler(isNotShadow)}>
    {lambda({ contents: BLOCKS_DICT[arg.id]?.contents }, ({ contents }) =>
      contents
        .map((content, i, contents) =>
          lambda({ index: computeArgIndex(contents, i) }, ({ index }) =>
            !isArg(content) ? (
              <>{content}</>
            ) : (
              <ScriptRoot
                {...props}
                arg={arg.arg[index]}
                indexes={[...indexes, index]}
                resetParentIsDragOver={dragOverChildElement}
              />
            ),
          ),
        )
        .reduce((acc, content, i) =>
          i === 0 ? (
            content
          ) : (
            <div key={i} className={blockDirectionHandler(contents[i] instanceof Array)}>
              {acc}
              {content}
            </div>
          ),
        ),
    )}
  </div>
);
