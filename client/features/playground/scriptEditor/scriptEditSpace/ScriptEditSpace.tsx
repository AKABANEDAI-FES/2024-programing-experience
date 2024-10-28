/* eslint-disable complexity */
/* eslint-disable max-lines */
import { ConditionalWrapper } from 'components/ConditionalWrapper';
import { DefinedWrapper } from 'components/DefinedWrapper';
import { BLOCKS_DICT } from 'features/playground/constants';
import type { BLOCK, blockArg, Scripts } from 'features/playground/types';
import { computeArgIndex } from 'features/playground/utils/computeArgIndex';
import { defaultBlock } from 'features/playground/utils/defaultBlock';
import { isArg } from 'features/playground/utils/isArg';
import { useScripts } from 'hooks/useScripts';
import type { Dispatch, SetStateAction } from 'react';
import React, { useCallback, useRef, useState } from 'react';
import { lambda } from 'utils/lambda';
import { resetEvent } from 'utils/resetEvent';
import styles1 from '../ScriptEditor.module.css';
import styles from './ScriptEditSpace.module.css';

type ScriptBlockProps = {
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
  onDetach?: (scriptIndex: number, indexes: number[], position: { x: number; y: number }) => void;
};

const blockClassHandler = (isNotShadow: boolean) =>
  isNotShadow ? styles1.block : styles1.blockShadow;
const blockDirectionHandler = (isArray: boolean) =>
  isArray ? styles1.blockColumn : styles1.blockRow;

const ScriptBlock = (props: ScriptBlockProps) => {
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
    onDetach,
  } = props;
  const [isDragOver, setIsDragOver] = useState<'false' | 'upper' | 'lower'>('false');
  const [isDragging, setIsDragging] = useState(false);
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

  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLElement>) => {
    e.stopPropagation();
    if (isNotShadow && indexes.length > 0 && arg instanceof Object) {
      setIsDragging(true);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragStartPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleDragFinish = (e: React.DragEvent<HTMLElement>) => {
    if (dragStartPos && isNotShadow && indexes.length > 0 && arg instanceof Object) {
      const containerRect = document
        .querySelector(`.${styles.scriptEditSpace}`)
        ?.getBoundingClientRect();
      if (containerRect) {
        onDetach?.(scriptIndex, indexes, {
          x: e.clientX - containerRect.left,
          y: e.clientY - containerRect.top,
        });
      }
      setDragStartPos(null);
    }
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    setIsDragOver('false');
    if (isDragging || dragStartPos) {
      return;
    }
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

  const rectHandler = (rect: DOMRect | undefined) =>
    rect ? { x: rect.x, y: rect.y, h: rect.height } : { x: 0, y: 0, h: 0 };
  return (
    <div
      ref={ref}
      draggable={isNotShadow && indexes.length > 0 && arg instanceof Object}
      onDragStart={handleDragStart}
      onDragLeave={resetEvent('p-', (e) => handleDragFinish(e))}
      onDragEnd={resetEvent('p-', (e) => handleDragFinish(e))}
      onDrop={handleDrop}
      onDragOver={resetEvent('ps', (e) => {
        resetParentIsDragOver?.();
        if (!(arg instanceof Array)) {
          const { y, h } = rectHandler(ref.current?.getBoundingClientRect());
          const { h: h2 } = rectHandler(ref2.current?.getBoundingClientRect());
          const { h: h3 } = rectHandler(ref3.current?.getBoundingClientRect());

          const isUpper = e.clientY < y + h2 + (h - h2 - h3) / 2;
          setIsDragOver(isUpper ? 'upper' : 'lower');
        }
      })}
      className={styles1.blockWrapper}
    >
      <ConditionalWrapper isRendering={[isDragOver === 'upper', isNotShadow].every(Boolean)}>
        <DefinedWrapper
          nullableArgs={{ targetBlock }}
          children={({ targetBlock }) => (
            <div ref={ref2}>
              <ScriptBlock
                {...props}
                arg={defaultBlock(targetBlock)}
                isNotShadow={false}
                dropOnPrevElement={dropOnNextElement}
                dropToParentElement={dropOnChildElement}
                isDragOver={isDragOver}
              />
            </div>
          )}
        />
      </ConditionalWrapper>
      {arg instanceof Array ? (
        <>
          <ConditionalWrapper isRendering={arg.length === 0}>
            <ScriptBlock
              {...props}
              arg={undefined}
              indexes={[...indexes, 0]}
              dropToParentElement={dropOnChildElement}
            />
          </ConditionalWrapper>
          {arg.map((scriptBlock, j) => (
            <ScriptBlock key={j} {...props} arg={scriptBlock} indexes={[...indexes, j]} />
          ))}
        </>
      ) : arg instanceof Object ? (
        <div className={blockClassHandler(isNotShadow)}>
          {lambda({ contents: BLOCKS_DICT[arg.id]?.contents }, ({ contents }) =>
            contents
              .map((content, i, contents) =>
                lambda({ index: computeArgIndex(contents, i) }, ({ index }) =>
                  !isArg(content) ? (
                    <>{content}</>
                  ) : (
                    <ScriptBlock
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
      ) : isNotShadow ? (
        <ConditionalWrapper isRendering={isDragOver === 'false' && arg !== undefined}>
          <input
            className={styles1.input}
            type="text"
            defaultValue={arg}
            onChange={(e) => {
              handleOnChange(e, scriptIndex, indexes);
            }}
          />
        </ConditionalWrapper>
      ) : (
        <div className={styles1.input}>{arg}</div>
      )}
      <ConditionalWrapper isRendering={[isDragOver === 'lower', isNotShadow].every(Boolean)}>
        <DefinedWrapper
          nullableArgs={{ targetBlock }}
          children={({ targetBlock }) => (
            <div ref={ref3}>
              <ScriptBlock
                {...props}
                arg={defaultBlock(targetBlock)}
                isNotShadow={false}
                dropOnPrevElement={dropOnNextElement}
                dropToParentElement={dropOnChildElement}
                isDragOver={isDragOver}
              />
            </div>
          )}
        />
      </ConditionalWrapper>
    </div>
  );
};

type Props = {
  scripts: Scripts;
  setScripts: Dispatch<SetStateAction<Scripts>>;
  targetBlock: BLOCK | null;
  targetPos: { x: number; y: number };
  children: React.ReactNode;
};

export const ScriptEditSpace = ({
  scripts,
  setScripts,
  targetBlock,
  targetPos,
  children,
}: Props) => {
  const { handleDrop, handleDragOver, handleOnChange, handleDropToInput, handleDetachBlock } =
    useScripts({
      scripts,
      setScripts,
      targetBlock,
      targetPos,
    });

  return (
    <div
      className={styles.scriptEditSpace}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ position: 'relative' }}
    >
      {children}
      {scripts.map((script, scriptIndex) => (
        <div
          key={scriptIndex}
          style={{
            position: 'absolute',
            left: `${script.position.x}px`,
            top: `${script.position.y}px`,
          }}
        >
          <ScriptBlock
            key={scriptIndex}
            arg={script.script}
            scriptIndex={scriptIndex}
            indexes={[]}
            targetBlock={targetBlock}
            isNotShadow={true}
            handleOnChange={handleOnChange}
            handleDrop={handleDropToInput}
            onDetach={handleDetachBlock}
          />
        </div>
      ))}
    </div>
  );
};
