import type { blockArg } from 'common/types/playground';
import { ConditionalWrapper } from 'components/ConditionalWrapper';
import { calcUpdateIndex } from 'features/playground/utils/calcUpdateIndex';
import { rectHandler } from 'features/playground/utils/rectHandler';
import type { Dispatch } from 'react';
import React, { useCallback, useRef, useState } from 'react';
import type { TargetBlockType } from 'types';
import { lambda } from 'utils/lambda';
import { resetEvent } from 'utils/resetEvent';
import { Block } from '../Block/Block';
import BlockGhost from '../Block/BlockGhost';
import { Input } from '../Input/Input';
import styles from './ScriptRoot.module.css';

export type Props = {
  arg: blockArg | undefined;
  scriptIndex: number;
  indexes: number[];
  targetBlock: TargetBlockType;
  isNotShadow: boolean;
  isDragOver?: 'false' | 'upper' | 'lower';
  handleOnChange: (inputValue: string, n: number, is: number[]) => void;
  handleDrop: (n: number, is: number[]) => void;
  resetParentIsDragOver?: () => void;
  dropOnPrevElement?: () => void;
  dropToParentElement?: (e: React.DragEvent<HTMLElement>) => void;
  handleDragStart: (n: number, is: number[]) => void;
  setTargetPos: Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  outTB?: TargetBlockType;
};

// eslint-disable-next-line complexity
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
    handleDragStart,
    setTargetPos,
    outTB,
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

    updateWithDrop(scriptIndex, [
      ...indexes.slice(0, -1),
      indexes[indexes.length - 1] - +(isDragOver === 'upper'),
    ]);

    dropOnPrevElement?.();
  }, []);

  const handleNotOnDrag = (e: React.DragEvent) => {
    if (!ref.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver('false');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    setIsDragOver('false');
    if ([typeof arg === 'string' && !isNotShadow].every(Boolean)) {
      dropToParentElement?.(e);
      return;
    } else {
      updateWithDrop(
        scriptIndex,
        calcUpdateIndex(indexes, parentIsDragOver, isDragOver, isNotShadow),
      );
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
      onDragLeave={resetEvent('p-', (e) => handleNotOnDrag(e))}
      onDragEnd={resetEvent('p-', (e) => handleNotOnDrag(e))}
      onDrop={resetEvent('ps', handleDrop)}
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
      key={`${outTB instanceof Array ? outTB?.map((e) => `${e.id}`).reduce((a, b) => `${a}-${b}`, '') : outTB?.id}`}
    >
      <BlockGhost
        isRendering={[isDragOver === 'lower', isNotShadow].every(Boolean)}
        {...ghostProps}
        ref={ref3}
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
          {lambda(
            {
              scripts: arg
                .map((scriptBlock, j) => (
                  <ScriptRoot key={j} {...props} arg={scriptBlock} indexes={[...indexes, j]} />
                ))
                .slice()
                .reverse(),
            },
            ({ scripts }) =>
              [<></>, ...scripts].reduce(
                (acc, content, i) =>
                  i === 0 ? (
                    content
                  ) : (
                    <div
                      key={`w${i}`}
                      draggable
                      className={styles.blockWrapper}
                      onDragStart={resetEvent('-s', (e) => {
                        handleDragStart(scriptIndex, [...indexes, i - 1]);
                        setTargetPos({
                          x: (e.target as HTMLDivElement).getBoundingClientRect().left - e.clientX,
                          y: (e.target as HTMLDivElement).getBoundingClientRect().top - e.clientY,
                        });
                      })}
                    >
                      {acc}
                      {content}
                    </div>
                  ),
                <></>,
              ),
          )}
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
              handleOnChange(e.target.value, scriptIndex, indexes);
            }}
          />
        </ConditionalWrapper>
      ) : (
        <Input defaultValue={arg} isNotInput />
      )}
      <BlockGhost
        isRendering={[isDragOver === 'upper', isNotShadow].every(Boolean)}
        {...ghostProps}
        ref={ref2}
      />
    </div>
  );
};
