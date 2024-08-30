import { useState } from 'react';
import styles from './Playground.module.css';
import { Preview } from './preview/Preview';
import { ScriptEditor } from './scriptEditor/ScriptEditor';
import type { Block } from './types';
const testScript = [
  [
    {
      id: 1,
      arg: ['10'],
    },
    {
      id: 6,
      arg: [
        'true',
        [
          { id: 1, arg: ['10'] },
          { id: 1, arg: ['10'] },
          { id: 2, arg: ['10'] },
          { id: 2, arg: ['10'] },
        ],
      ],
    },
  ],
];

export const Playground = () => {
  const [scripts, setScripts] = useState<Block[][]>(testScript);
  return (
    <div className={styles.main}>
      <ScriptEditor scripts={scripts} setScripts={setScripts}></ScriptEditor>
      <Preview scripts={scripts} key={JSON.stringify(scripts)}></Preview>
    </div>
  );
};
