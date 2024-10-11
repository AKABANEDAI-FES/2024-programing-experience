/* eslint-disable max-lines */
import { ConditionalWrapper } from 'components/ConditionalWrapper';
import { DefinedWrapper } from 'components/DefinedWrapper';
import { BLOCKS_DICT } from 'features/playground/constants';
import type { Block, BLOCK, blockArg } from 'features/playground/types';
import { computeArgIndex } from 'features/playground/utils/computeArgIndex';
import { defaultBlock } from 'features/playground/utils/defaultBlock';
import { isArg } from 'features/playground/utils/isArg';
import { useScripts } from 'hooks/useScripts';
import type { Dispatch, SetStateAction } from 'react';
import React, { useCallback, useRef, useState } from 'react';
import { resetEvent } from 'utils/resetEvent';
import styles1 from '../ScriptEditor.module.css';
import styles from './ScriptEditSpace.module.css';

type ScriptBlockProps = {
  arg: blockArg | undefined;
  scriptIndex: number;
  indexes: number[];
  targetBlock: BLOCK | null;
  isNotShadow: boolean;
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement>, n: number, is: number[]) => void;
  handleDrop: (e: React.DragEvent<HTMLElement>, n: number, is: number[]) => void;
  resetParentIsDragOver?: () => void;
  dropOnPrevElement?: () => void;
  dropToParentElement?: (e: React.DragEvent<HTMLElement>) => void;
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
    handleOnChange,
    handleDrop,
    resetParentIsDragOver,
    dropOnPrevElement,
    dropToParentElement,
  } = props;
  const [isDragOver, setIsDragOver] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const dragOverChildElement = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const dropOnNextElement = useCallback(() => {
    setIsDragOver(false);
  }, []);
  const dropOnChildElement = useCallback((e: React.DragEvent<HTMLElement>) => {
    setIsDragOver(false);

    handleDrop(e, scriptIndex, indexes);

    dropOnPrevElement?.();
  }, []);

  const handleDragFinish = (e: React.DragEvent) => {
    if (!ref.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };
  return (
    <div
      ref={ref}
      onDragLeave={resetEvent('p-', (e) => handleDragFinish(e))}
      onDragEnd={resetEvent('p-', (e) => handleDragFinish(e))}
      onDrop={(e) => {
        setIsDragOver(false);
        handleDrop(e, scriptIndex, indexes);
        dropOnPrevElement?.();
      }}
      onDragOver={resetEvent('ps', () => {
        resetParentIsDragOver?.();
        if (!(arg instanceof Array)) {
          setIsDragOver(true);
        }
      })}
      className={styles1.blockWrapper}
    >
      {arg instanceof Array ? (
        <>
          <ConditionalWrapper isRendering={arg.length === 0}>
            <ScriptBlock
              {...props}
              arg={''}
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
          {BLOCKS_DICT[arg.id]?.contents
            .map((content, i, contents) => {
              if (!isArg(content)) {
                return <>{content}</>;
              }

              const index = computeArgIndex(contents, i);
              return (
                <ScriptBlock
                  {...props}
                  arg={arg.arg[index]}
                  indexes={[...indexes, index]}
                  resetParentIsDragOver={dragOverChildElement}
                />
              );
            })
            .reduce((acc, content, i) => {
              if (i === 0) {
                return content;
              }
              const isArray = BLOCKS_DICT[arg.id]?.contents[i] instanceof Array;
              return (
                <div key={i} className={blockDirectionHandler(isArray)}>
                  {acc}
                  {content}
                </div>
              );
            })}
        </div>
      ) : isNotShadow ? (
        <input
          className={styles1.input}
          type="text"
          defaultValue={arg}
          style={{ display: !isDragOver ? 'block' : 'none' }}
          onChange={(e) => {
            handleOnChange(e, scriptIndex, indexes);
          }}
          onDrop={resetEvent('ps', (e) => {
            dropToParentElement?.(e);
          })}
          disabled={arg === undefined}
        />
      ) : (
        <div className={styles1.input}>{arg}</div>
      )}
      <ConditionalWrapper isRendering={[isDragOver, isNotShadow].every(Boolean)}>
        <DefinedWrapper
          nullableArgs={{ targetBlock }}
          children={({ targetBlock }) => (
            <ScriptBlock
              {...props}
              arg={defaultBlock(targetBlock)}
              isNotShadow={false}
              dropOnPrevElement={dropOnNextElement}
              dropToParentElement={dropOnChildElement}
            />
          )}
        ></DefinedWrapper>
      </ConditionalWrapper>
    </div>
  );
};

type Props = {
  scripts: Block[][];
  setScripts: Dispatch<SetStateAction<Block[][]>>;
  targetBlock: BLOCK | null;
};

export const ScriptEditSpace = ({ scripts, setScripts, targetBlock }: Props) => {
  const { handleDrop, handleDragOver, handleOnChange, handleDropToInput } = useScripts({
    scripts,
    setScripts,
    targetBlock,
  });

  return (
    <div className={styles.scriptEditSpace} onDrop={handleDrop} onDragOver={handleDragOver}>
      {scripts.map((script, scriptIndex) => (
        <div key={scriptIndex}>
          <ScriptBlock
            key={scriptIndex}
            arg={script}
            scriptIndex={scriptIndex}
            indexes={[]}
            targetBlock={targetBlock}
            isNotShadow={true}
            handleOnChange={handleOnChange}
            handleDrop={handleDropToInput}
          />
        </div>
      ))}
    </div>
  );
};
