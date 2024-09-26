/* eslint-disable max-lines */
import { BLOCKS_DICT } from 'features/playground/constants';
import type { Block, BLOCK, blockArg } from 'features/playground/types';
import { defaultBlock } from 'features/playground/utils/defaultBlock';
import { isArg } from 'features/playground/utils/isArg';
import { updateScriptValue } from 'features/playground/utils/updateScriptValue';
import type { Dispatch, SetStateAction } from 'react';
import React, { useCallback, useRef, useState } from 'react';
import styles1 from '../ScriptEditor.module.css';
import styles from './ScriptEditSpace.module.css';

type ScriptBlockProps = {
  arg: blockArg;
  scriptIndex: number;
  indexes: number[];
  targetBlock: BLOCK | null;
  isNotShadow: boolean;
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement>, n: number, is: number[]) => void;
  handleDrop: (e: React.DragEvent<HTMLElement>, n: number, is: number[]) => void;
  resetParentIsDragOver?: () => void;
};

// eslint-disable-next-line complexity
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
  } = props;
  const [isDragOver, setIsDragOver] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const dragOverChildElement = useCallback(() => {
    setIsDragOver(false);
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
      }}
      onDragOver={(e) => {
        e.stopPropagation();
        e.preventDefault();

        resetParentIsDragOver?.();

        setIsDragOver(true);
      }}
      style={{ border: '1px solid black' }}
    >
      {typeof arg === 'string' ? (
        <input
          className={styles1.input}
          type="text"
          defaultValue={arg}
          style={{ display: !isDragOver ? 'block' : 'none' }}
          onChange={(e) => {
            handleOnChange(e, scriptIndex, indexes);
          }}
        />
      ) : arg instanceof Array ? (
        arg.length === 0 ? (
          <ScriptBlock {...props} arg={''} indexes={[...indexes, 0]} />
        ) : (
          arg.map((scriptBlock, j) => (
            <ScriptBlock key={j} {...props} arg={scriptBlock} indexes={[...indexes, j]} />
          ))
        )
      ) : (
        <div className={isNotShadow ? styles1.block : styles1.blockShadow}>
          {BLOCKS_DICT[arg.id]?.contents.map((content, i, contents) => {
            if (isArg(content)) {
              const argIndex = contents.slice(0, i).filter(isArg).length;
              const newIndexes = [...indexes, argIndex];
              return (
                <ScriptBlock
                  key={i}
                  {...props}
                  arg={arg.arg[argIndex]}
                  indexes={newIndexes}
                  resetParentIsDragOver={dragOverChildElement}
                />
              );
            }
            return <div key={i}>{content}</div>;
          })}
        </div>
      )}
      {isDragOver && isNotShadow && targetBlock && (
        <ScriptBlock {...props} arg={defaultBlock(targetBlock)} isNotShadow={false} />
      )}
    </div>
  );
};

type Props = {
  scripts: Block[][];
  setScripts: Dispatch<SetStateAction<Block[][]>>;
  targetBlock: BLOCK | null;
};

export const ScriptEditSpace = (scriptEditSpaceProps: Props) => {
  const { scripts, setScripts, targetBlock } = scriptEditSpaceProps;

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (targetBlock === null) return;

    const newScripts = structuredClone(scripts);

    newScripts.push([defaultBlock(targetBlock)]);
    setScripts(newScripts);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    scriptIndex: number,
    indexes: number[],
  ) => {
    const newScripts = structuredClone(scripts);

    updateScriptValue(e.target.value, newScripts[scriptIndex], indexes);
    setScripts(newScripts);
  };

  const handleDropToInput = (
    e: React.DragEvent<HTMLElement>,
    scriptIndex: number,
    indexes: number[],
  ) => {
    if (targetBlock === null) return;
    const newScripts = structuredClone(scripts);

    updateScriptValue(defaultBlock(targetBlock), newScripts[scriptIndex], indexes);
    setScripts(newScripts);

    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={styles.scriptEditSpace} onDrop={handleDrop} onDragOver={handleDragOver}>
      {scripts.map((script, scriptIndex) => (
        <div key={scriptIndex}>
          {/* {script.map((block, n) => (
            <ScriptBlock
              key={`${scriptIndex}-${n}`}
              arg={block}
              scriptIndex={scriptIndex}
              indexes={[n]}
              targetBlock={targetBlock}
              isNotShadow={true}
              handleOnChange={handleOnChange}
              handleDrop={handleDropToInput}
            />
          ))} */}
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
