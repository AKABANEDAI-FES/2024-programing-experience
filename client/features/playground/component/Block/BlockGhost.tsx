import { ConditionalWrapper } from 'components/ConditionalWrapper';
import { DefinedWrapper } from 'components/DefinedWrapper';
import type { Props as RootProps } from 'features/playground/component/ScriptRoot/ScriptRoot';
import React, { forwardRef } from 'react';
import type { TargetBlockType } from 'types';
import { resetEvent } from 'utils/resetEvent';
import { ScriptRoot } from '../ScriptRoot/ScriptRoot';

type Props = {
  isRendering: boolean;
  targetBlock: TargetBlockType;
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
            arg={targetBlock}
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
