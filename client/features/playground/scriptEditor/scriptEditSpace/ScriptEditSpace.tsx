/* eslint-disable max-lines */
import { BLOCKS_DICT } from 'features/playground/constants';
import type { Block, BLOCK, blockArg } from 'features/playground/types';
import type { Dispatch, SetStateAction } from 'react';
import React, { useCallback, useRef, useState } from 'react';
import { isArg } from '../../utils/isArg';
import styles1 from '../ScriptEditor.module.css';
import styles from './ScriptEditSpace.module.css';
// eslint-disable-next-line complexity
const updateScriptValue = (
  arg: Exclude<blockArg, Block[]>,
  script: Exclude<blockArg, string>,
  indexes: number[],
) => {
  const newIndexes = [...indexes];
  const index = newIndexes.shift();
  if (index === undefined) {
    throw new Error('Invalid index');
  }
  if (script instanceof Array) {
    if (script[index] === undefined) {
      // eslint-disable-next-line max-depth
      if (typeof arg === 'string') {
        throw new Error('Invalid arg');
      }
      script.push(arg);
      return;
    }
    if (newIndexes.length <= 0) {
      // eslint-disable-next-line max-depth
      if (typeof arg === 'string') {
        throw new Error('Invalid arg');
      }
      script.splice(index + 1, 0, arg);
      return;
    }
    updateScriptValue(arg, script[index], newIndexes);
    return;
  }
  if (newIndexes.length <= 0) {
    script.arg[index] = arg ?? '';
    return;
  }
  if (typeof script.arg[index] === 'string') {
    throw new Error('Invalid indexes');
  }
  updateScriptValue(arg, script.arg[index], newIndexes);
  return;
};

type ScriptBlockProps = {
  block: Block;
  scriptIndex: number;
  indexes: number[];
  targetBlock: BLOCK | null;
  isNotShadow: boolean;
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement>, n: number, is: number[]) => void;
  handleDrop: (e: React.DragEvent<HTMLElement>, n: number, is: number[]) => void;
  resetParentIsDragOver?: () => void;
  nextElmNotDragHandler?: () => void;
};

const ScriptBlock = (props: ScriptBlockProps) => {
  const {
    block,
    scriptIndex,
    indexes,
    targetBlock,
    isNotShadow,
    handleOnChange,
    handleDrop,
    resetParentIsDragOver,
    nextElmNotDragHandler: prevElemNotDragOverHandler,
  } = props;
  const [isDragOver, setIsDragOver] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dragOverChildElement = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const nextElmNotDragHandler = useCallback(() => {
    setIsDragOver(false);
  }, []);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();

        e.stopPropagation();

        resetParentIsDragOver?.();

        setIsDragOver(true);
      }}
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
      ref={ref}
    >
      <div
        style={{ display: 'flex', flexDirection: 'row' }}
        onDrop={(e) => {
          setIsDragOver(false);

          handleDrop(e, scriptIndex, indexes);
          prevElemNotDragOverHandler?.();
        }}
        onMouseOver={(e) => {
          e.stopPropagation();
        }}
        className={isNotShadow ? styles1.block : styles1.blockShadow}
      >
        {BLOCKS_DICT[block.id]?.contents.map((content, i, contents) => {
          if (isArg(content)) {
            const argIndex = contents.slice(0, i).filter(isArg).length;
            const newIndexes = [...indexes, argIndex];
            const arg = block.arg[argIndex];
            if (typeof arg === 'string') {
              return (
                <input
                  className={styles1.input}
                  key={i}
                  type="text"
                  defaultValue={arg}
                  onChange={(e) => {
                    handleOnChange(e, scriptIndex, newIndexes);
                  }}
                  onDrop={(e) => {
                    setIsDragOver(false);

                    handleDrop(e, scriptIndex, newIndexes);
                    prevElemNotDragOverHandler?.();
                  }}
                />
              );
            }
            if (arg instanceof Array) {
              return (
                <div style={{ flexDirection: 'column' }} key={i}>
                  {arg.map((scriptBlock, j) => (
                    <ScriptBlock
                      key={`${i}-${j}`}
                      block={scriptBlock}
                      scriptIndex={scriptIndex}
                      indexes={[...newIndexes, j]}
                      targetBlock={targetBlock}
                      isNotShadow={isNotShadow}
                      handleOnChange={handleOnChange}
                      handleDrop={handleDrop}
                      resetParentIsDragOver={dragOverChildElement}
                    />
                  ))}
                  {arg.length === 0 && (
                    <input
                      className={styles1.input}
                      type="text"
                      onDrop={(e) => {
                        setIsDragOver(false);

                        handleDrop(e, scriptIndex, [...newIndexes, 0]);
                        prevElemNotDragOverHandler?.();
                      }}
                    />
                  )}
                </div>
              );
            }
            return (
              <ScriptBlock
                key={i}
                block={arg}
                scriptIndex={scriptIndex}
                indexes={newIndexes}
                targetBlock={targetBlock}
                isNotShadow={isNotShadow}
                handleOnChange={handleOnChange}
                handleDrop={handleDrop}
              />
            );
          }
          return <div key={i}>{content}</div>;
        })}
      </div>
      {isDragOver && isNotShadow && targetBlock && (
        <ScriptBlock
          block={defaultBlock(targetBlock)}
          scriptIndex={scriptIndex}
          indexes={indexes}
          targetBlock={targetBlock}
          isNotShadow={false}
          handleOnChange={handleOnChange}
          handleDrop={handleDrop}
          nextElmNotDragHandler={nextElmNotDragHandler}
        />
      )}
    </div>
  );
};

const defaultBlock = ({ id, contents }: BLOCK) => ({
  id,
  arg: contents.filter(isArg).map((a) => (a instanceof Array ? a : a.replace('$', ''))),
});

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
          {script.map((block, n) => (
            <ScriptBlock
              key={`${scriptIndex}-${n}`}
              block={block}
              scriptIndex={scriptIndex}
              indexes={[n]}
              targetBlock={targetBlock}
              isNotShadow={true}
              handleOnChange={handleOnChange}
              handleDrop={handleDropToInput}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
