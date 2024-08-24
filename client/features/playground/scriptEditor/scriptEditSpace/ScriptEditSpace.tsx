import { BLOCKS_DICT } from 'features/playground/constants';
import type { Block, BLOCK } from 'features/playground/types';
import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import styles from '../ScriptEditor.module.css';

const updateScriptValue = (arg: Block | string, script: Block, indexes: number[]) => {
  const index = indexes.shift();
  if (index === undefined) {
    throw new Error('Invalid index');
  }
  if (indexes.length > 0) {
    if (typeof script.arg[index] === 'string') {
      throw new Error('Invalid indexes');
    }
    updateScriptValue(arg, script.arg[index], indexes);
  }
  script.arg[index] = arg ?? '';
};

type ScriptBlockProps = {
  block: Block;
  n: number;
  indexes: number[];
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement>, n: number, is: number[]) => void;
};

const ScriptBlock = (props: ScriptBlockProps) => {
  const { block, n, indexes, handleOnChange } = props;
  return (
    <>
      {BLOCKS_DICT[block.id]?.contents.map((content, i, contents) => {
        if (content.startsWith('$')) {
          const argIndex = contents.slice(0, i).filter((content) => content.startsWith('$')).length;
          const newIndexes = [...indexes, argIndex];
          const arg = block.arg[argIndex];
          if (typeof arg === 'string') {
            return (
              <input
                className={styles.input}
                key={i}
                type="text"
                defaultValue={arg}
                onChange={(e) => handleOnChange(e, n, newIndexes)}
              />
            );
          }
          return (
            <ScriptBlock
              key={i}
              block={arg}
              n={n}
              indexes={newIndexes}
              handleOnChange={handleOnChange}
            />
          );
        }
        return <div key={i}>{content}</div>;
      })}
    </>
  );
};

type Props = {
  script: Block[] | undefined;
  setScript: Dispatch<SetStateAction<Block[] | undefined>>;
  targetBlock: BLOCK | null;
};

export const ScriptEditSpace = (scriptEditSpaceProps: Props) => {
  const { script, setScript, targetBlock } = scriptEditSpaceProps;

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (targetBlock === null) return;
    const newScript = structuredClone(script ?? []);
    newScript.push({
      id: targetBlock.id,
      arg: targetBlock.contents
        .filter((content) => content.startsWith('$'))
        .map((content) => content.replace('$', '')),
    });
    setScript(newScript);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>, n: number, indexes: number[]) => {
    const newScript = structuredClone(script ?? []);

    updateScriptValue(e.target.value, newScript[n], indexes);
    setScript(newScript);
  };

  return (
    <div className={styles.scriptEditSpace} onDrop={handleDrop} onDragOver={handleDragOver}>
      {script?.map((block, n) => (
        <div className={styles.block}>
          <ScriptBlock key={n} block={block} n={n} indexes={[]} handleOnChange={handleOnChange} />
        </div>
      ))}
    </div>
  );
};
