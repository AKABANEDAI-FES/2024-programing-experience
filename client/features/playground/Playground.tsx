import { useState } from 'react';
import styles from './Playground.module.css';
import { Preview } from './Preview';
import { ScriptEditor } from './ScriptEditor';

const BLOCKS: {
  id: number;
  contents: string[];
}[] = [
  { id: 1, contents: ['前へ', '$number', '歩進む'] },
  { id: 2, contents: ['右へ', '$number', '度回る'] },
  { id: 3, contents: ['左へ', '$number', '度回る'] },
];

export const Playground = () => {
  const [script, setScript] = useState<{ id: number; arg: string[] }[]>();
  return (
    <div className={styles.main}>
      <ScriptEditor script={script} setScript={setScript} BLOCKS={BLOCKS}></ScriptEditor>
      <Preview script={script}></Preview>
    </div>
  );
};
