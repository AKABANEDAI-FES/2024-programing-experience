import { ConditionalWrapper } from 'components/ConditionalWrapper';
import { DefinedWrapper } from 'components/DefinedWrapper';
import type { Props as RootProps } from 'features/playground/component/ScriptRoot/ScriptRoot';
import type { BLOCK } from 'features/playground/types';
import { defaultBlock } from 'features/playground/utils/defaultBlock';
import React, { forwardRef } from 'react';
import { resetEvent } from 'utils/resetEvent';
import { ScriptRoot } from '../ScriptRoot/ScriptRoot';

type Props = {
  isRendering: boolean;
  targetBlock: BLOCK | null;
  isDragOver: 'false' | 'upper' | 'lower';
  props: RootProps;
  dropOnNextElement: () => void;
  dropOnChildElement: (e: React.DragEvent<HTMLElement>) => void;
};

const BlockGhost = forwardRef<HTMLDivElement, Props>((props, ref) => (
  <ConditionalWrapper isRendering={props.isRendering}>
    <DefinedWrapper
      nullableArgs={{ targetBlock: props.targetBlock }}
      children={({ targetBlock }) => (
        <div ref={ref} onDragOver={resetEvent('-s')}>
          <ScriptRoot
            {...props.props}
            arg={defaultBlock(targetBlock)}
            isNotShadow={false}
            dropOnPrevElement={props.dropOnNextElement}
            dropToParentElement={props.dropOnChildElement}
            isDragOver={props.isDragOver}
          />
        </div>
      )}
    />
  </ConditionalWrapper>
));

export default BlockGhost;
