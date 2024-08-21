import { useState } from 'react';
import styles from './Playground.module.css';
import { Preview } from './Preview';
import { ScriptEditor } from './ScriptEditor';
export type Block = { id: number; arg: (Block | string)[] };
export type BLOCK = { id: number; contents: string[] };

const BLOCKS: BLOCK[] = [
  { id: 1, contents: ['前へ', '$number', '歩進む'] },
  { id: 2, contents: ['右へ', '$number', '度回る'] },
  { id: 3, contents: ['左へ', '$number', '度回る'] },
  { id: 5, contents: ['後ろへ', '$number', '歩戻る'] },
  { id: 4, contents: ['$number', '秒待つ'] },
];

export const Playground = () => {
  const [script, setScript] = useState<Block[]>();
  return (
    <div className={styles.main}>
      <ScriptEditor script={script} setScript={setScript} BLOCKS={BLOCKS}></ScriptEditor>
      <Preview script={script}></Preview>
    </div>
  );
};
