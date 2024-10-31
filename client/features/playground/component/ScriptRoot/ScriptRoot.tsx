import type { blockArg } from 'common/types/playground';
import { ConditionalWrapper } from 'components/ConditionalWrapper';
import type { BLOCK } from 'features/playground/types';
import { rectHandler } from 'features/playground/utils/rectHandler';
import { useCallback, useRef, useState } from 'react';
import { resetEvent } from 'utils/resetEvent';
import { Block } from '../Block/Block';
import BlockGhost from '../Block/BlockGhost';
import { Input } from '../Input/Input';
import styles from './ScriptRoot.module.css';

export type Props = {
  arg: blockArg | undefined;
  scriptIndex: number;
  indexes: number[];
  targetBlock: BLOCK | null;
  isNotShadow: boolean;
  isDragOver?: 'false' | 'upper' | 'lower';
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement>, n: number, is: number[]) => void;
  handleDrop: (e: React.DragEvent<HTMLElement>, n: number, is: number[]) => void;
  resetParentIsDragOver?: () => void;
  dropOnPrevElement?: () => void;
  dropToParentElement?: (e: React.DragEvent<HTMLElement>) => void;
};

export const ScriptRoot = (props: Props) => {
  const {
    arg,
    scriptIndex,
    indexes,
    targetBlock,
    isNotShadow,
    isDragOver: parentIsDragOver,
    handleOnChange,
    handleDrop: updateWithDrop,
    resetParentIsDragOver,
    dropOnPrevElement,
    dropToParentElement,
  } = props;

  const [isDragOver, setIsDragOver] = useState<'false' | 'upper' | 'lower'>('false');
  const ref = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);

  const dragOverChildElement = useCallback(() => {
    setIsDragOver('false');
  }, []);

  const dropOnNextElement = useCallback(() => {
    setIsDragOver('false');
  }, []);

  const dropOnChildElement = useCallback((e: React.DragEvent<HTMLElement>) => {
    setIsDragOver('false');

    updateWithDrop(e, scriptIndex, [
      ...indexes.slice(0, -1),
      indexes[indexes.length - 1] - +(isDragOver === 'upper'),
    ]);

    dropOnPrevElement?.();
  }, []);

  const handleDragFinish = (e: React.DragEvent) => {
    if (!ref.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver('false');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    setIsDragOver('false');
    if (arg !== undefined) {
      updateWithDrop(e, scriptIndex, [
        ...indexes.slice(0, -1),
        indexes[indexes.length - 1] - +((parentIsDragOver ?? isDragOver) === 'upper'),
      ]);
    } else {
      dropToParentElement?.(e);
    }
    dropOnPrevElement?.();
  };

  const ghostProps = {
    targetBlock,
    isDragOver,
    props,
    dropOnNextElement,
    dropOnChildElement,
  };

  return (
    <div
      ref={ref}
      onDragLeave={resetEvent('p-', (e) => handleDragFinish(e))}
      onDragEnd={resetEvent('p-', (e) => handleDragFinish(e))}
      onDrop={handleDrop}
      onDragOver={resetEvent('ps', (e) => {
        resetParentIsDragOver?.();
        if (!(arg instanceof Array)) {
          const { y, h } = rectHandler(ref.current);
          const { h: h2 } = rectHandler(ref2.current);
          const { h: h3 } = rectHandler(ref3.current);

          const isUpper = e.clientY < y + h2 + (h - h2 - h3) / 2;
          setIsDragOver(isUpper ? 'upper' : 'lower');
        }
      })}
      className={styles.blockWrapper}
    >
      <BlockGhost
        isRendering={[isDragOver === 'upper', isNotShadow].every(Boolean)}
        {...ghostProps}
        ref={ref2}
      />
      {arg instanceof Array ? (
        <>
          <ConditionalWrapper isRendering={arg.length === 0}>
            <ScriptRoot
              {...props}
              arg={undefined}
              indexes={[...indexes, 0]}
              dropToParentElement={dropOnChildElement}
            />
          </ConditionalWrapper>
          {arg.map((scriptBlock, j) => (
            <ScriptRoot key={j} {...props} arg={scriptBlock} indexes={[...indexes, j]} />
          ))}
        </>
      ) : arg instanceof Object ? (
        <Block
          arg={arg}
          indexes={indexes}
          isNotShadow={isNotShadow}
          props={props}
          dragOverChildElement={dragOverChildElement}
        />
      ) : isNotShadow ? (
        <ConditionalWrapper isRendering={isDragOver === 'false' && arg !== undefined}>
          <Input
            defaultValue={arg}
            onChange={(e) => {
              handleOnChange(e, scriptIndex, indexes);
            }}
          />
        </ConditionalWrapper>
      ) : (
        <Input defaultValue={arg} isNotInput />
      )}
      <BlockGhost
        isRendering={[isDragOver === 'lower', isNotShadow].every(Boolean)}
        {...ghostProps}
        ref={ref3}
      />
    </div>
  );
};
