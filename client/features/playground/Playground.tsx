import { useState } from 'react';
import styles from './Playground.module.css';
import { Preview } from './preview/Preview';
import { ScriptEditor } from './scriptEditor/ScriptEditor';
import type { Block } from './types';

export const Playground = () => {
  const [script, setScript] = useState<Block[]>();
  return (
    <div className={styles.main}>
      <ScriptEditor script={script} setScript={setScript}></ScriptEditor>
      <Preview script={script}></Preview>
    </div>
  );
};
