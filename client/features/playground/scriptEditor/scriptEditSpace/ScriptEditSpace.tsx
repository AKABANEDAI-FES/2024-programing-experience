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
    handleDrop: updateWithDrop,
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

    updateWithDrop(e, scriptIndex, indexes);

    dropOnPrevElement?.();
  }, []);

  const handleDragFinish = (e: React.DragEvent) => {
    if (!ref.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };
  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    setIsDragOver(false);
    if (arg !== undefined) {
      updateWithDrop(e, scriptIndex, indexes);
    } else {
      dropToParentElement?.(e);
    }
    dropOnPrevElement?.();
  };
  return (
    <div
      ref={ref}
      onDragLeave={resetEvent('p-', (e) => handleDragFinish(e))}
      onDragEnd={resetEvent('p-', (e) => handleDragFinish(e))}
      onDrop={handleDrop}
      onDragOver={resetEvent('ps', () => {
        resetParentIsDragOver?.();
        if (!(arg instanceof Array) || arg.length === 0) {
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
        <ConditionalWrapper isRendering={!isDragOver && arg !== undefined}>
          <input
            className={styles1.input}
            type="text"
            defaultValue={arg}
            onChange={(e) => {
              handleOnChange(e, scriptIndex, indexes);
            }}
            onDrop={resetEvent('ps', (e) => {
              dropToParentElement?.(e);
            })}
          />
        </ConditionalWrapper>
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
      ))}
    </div>
  );
};
