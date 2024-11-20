import { useState } from 'react';
import type { TargetBlockType } from 'types';
import type { Scripts } from '../types';
import styles from './ScriptEditor.module.css';
import { ScriptEditSpace } from './scriptEditSpace/ScriptEditSpace';
import { ScriptPalette } from './scriptPalette/ScriptPalette';

type Props = {
  scripts: Scripts;
  setScripts: (v: Scripts) => void;
};
export const ScriptEditor = (props: Props) => {
  const [targetBlock, setTargetBlock] = useState<TargetBlockType>(null);
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const { scripts, setScripts } = props;
  return (
    <div className={styles.main}>
      <ScriptEditSpace
        scripts={scripts}
        setScripts={setScripts}
        targetBlock={targetBlock}
        setTargetBlock={setTargetBlock}
        setTargetPos={setTargetPos}
        targetPos={targetPos}
      >
        <ScriptPalette setTargetBlock={setTargetBlock} setTargetPos={setTargetPos} />
      </ScriptEditSpace>
    </div>
  );
};
