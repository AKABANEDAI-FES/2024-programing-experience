import { useState } from 'react';
import styles from './Playground.module.css';
import { Preview } from './Preview';
import { ScriptEditor } from './ScriptEditor';
export type Block = { id: number; arg: (Block | string)[] };
export type BLOCKS_TYPE = Record<
  number,
  {
    contents: string[];
  }
>;

const BLOCKS: BLOCKS_TYPE = {
  1: { contents: ['前へ', '$number', '歩進む'] },
  2: { contents: ['右へ', '$number', '度回る'] },
  3: { contents: ['左へ', '$number', '度回る'] },
  4: { contents: ['$number', '秒待つ'] },
  5: { contents: ['後ろへ', '$number', '歩戻る'] },
};

export const Playground = () => {
  const [script, setScript] = useState<Block[]>();
  return (
    <div className={styles.main}>
      <ScriptEditor script={script} setScript={setScript} BLOCKS={BLOCKS}></ScriptEditor>
      <Preview script={script}></Preview>
    </div>
  );
};
