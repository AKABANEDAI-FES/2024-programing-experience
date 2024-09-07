import { BLOCKS_DICT } from 'features/playground/constants';
import type { Block, BLOCK, blockArg } from 'features/playground/types';
import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
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
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement>, n: number, is: number[]) => void;
  handleDrop: (e: React.DragEvent<HTMLInputElement>, n: number, is: number[]) => void;
};

const ScriptBlock = (props: ScriptBlockProps) => {
  const { block, scriptIndex, indexes, handleOnChange, handleDrop } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
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
                onChange={(e) => handleOnChange(e, scriptIndex, newIndexes)}
                onDrop={(e) => handleDrop(e, scriptIndex, newIndexes)}
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
                    handleOnChange={handleOnChange}
                    handleDrop={handleDrop}
                  />
                ))}
                <input
                  className={styles1.input}
                  type="text"
                  defaultValue={''}
                  onDrop={(e) => handleDrop(e, scriptIndex, [...newIndexes, arg.length])}
                />
              </div>
            );
          }
          return (
            <ScriptBlock
              key={i}
              block={arg}
              scriptIndex={scriptIndex}
              indexes={newIndexes}
              handleOnChange={handleOnChange}
              handleDrop={handleDrop}
            />
          );
        }
        return <div key={i}>{content}</div>;
      })}
    </div>
  );
};

const defaultBlock = ({ id, contents }: BLOCK) => ({
  id,
  arg: contents.filter(isArg).map((a) => (a instanceof Array ? [] : a.replace('$', ''))),
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

    newScripts[0].push(defaultBlock(targetBlock));
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
    e: React.DragEvent<HTMLInputElement>,
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
    <div
      className={styles.scriptEditSpace}
      // onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {scripts.map((script, scriptIndex) => (
        <div>
          {script.map((block, n) => (
            <div className={styles1.block} key={n}>
              <ScriptBlock
                key={`${scriptIndex}-${n}`}
                block={block}
                scriptIndex={scriptIndex}
                indexes={[n]}
                handleOnChange={handleOnChange}
                handleDrop={handleDropToInput}
              />
            </div>
          ))}
          {'['}
          <input
            className={styles.input}
            type="text"
            defaultValue={''}
            onDrop={(e) => handleDropToInput(e, scriptIndex, [script.length])}
            key={scriptIndex}
          />
          {']'}
        </div>
      ))}
    </div>
  );
};
