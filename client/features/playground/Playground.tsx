import { useState } from 'react';
import styles from './Playground.module.css';
import { Preview } from './preview/Preview';
import { ScriptEditor } from './scriptEditor/ScriptEditor';
import type { Block } from './types';

export const Playground = () => {
  const [scripts, setScripts] = useState<Block[][]>([[]]);
  return (
    <div className={styles.main}>
      <ScriptEditor scripts={scripts} setScripts={setScripts}></ScriptEditor>
      <Preview scripts={scripts}></Preview>
    </div>
  );
};
