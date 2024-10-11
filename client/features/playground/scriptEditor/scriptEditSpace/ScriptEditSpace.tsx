/* eslint-disable max-lines */
import { ConditionalWrapper } from 'components/ConditionalWrapper';
import { DefinedWrapper } from 'components/DefinedWrapper';
import { BLOCKS_DICT } from 'features/playground/constants';
import type { Block, BLOCK, blockArg } from 'features/playground/types';
import { defaultBlock } from 'features/playground/utils/defaultBlock';
import { isArg } from 'features/playground/utils/isArg';
import { useScripts } from 'hooks/useScripts';
import type { Dispatch, SetStateAction } from 'react';
import React, { useCallback, useRef, useState } from 'react';
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
  position?: { x: number; y: number };
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

  return (
    <div
      ref={ref}
      onDragLeave={(e) => {
        e.preventDefault();
        if (!ref.current?.contains(e.relatedTarget as Node)) {
          setIsDragOver(false);
        }
      }}
      onDragEnd={(e) => {
        e.preventDefault();
        if (!ref.current?.contains(e.relatedTarget as Node)) {
          setIsDragOver(false);
        }
      }}
      onDrop={(e) => {
        setIsDragOver(false);
        handleDrop(e, scriptIndex, indexes);
        dropOnPrevElement?.();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        resetParentIsDragOver?.();

        e.stopPropagation();

        if (!(arg instanceof Array)) {
          setIsDragOver(true);
        }
      }}
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
            .map((content, i, contents) =>
              isArg(content) ? (
                <ScriptBlock
                  {...props}
                  arg={arg.arg[contents.slice(0, i).filter(isArg).length]}
                  indexes={[...indexes, contents.slice(0, i).filter(isArg).length]}
                  resetParentIsDragOver={dragOverChildElement}
                />
              ) : (
                <>{content}</>
              ),
            )
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
          onDrop={(e) => {
            e.stopPropagation();
            e.preventDefault();
            dropToParentElement?.(e);
          }}
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
    <div
      className={styles.scriptEditSpace}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ position: 'relative' }}
    >
      {scripts.map((script, scriptIndex) => (
        <div
          key={scriptIndex}
          style={{
            position: 'absolute',
            left: `${script[0]?.position?.x || 0}px`,
            top: `${script[0]?.position?.y || 0}px`,
          }}
        >
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
