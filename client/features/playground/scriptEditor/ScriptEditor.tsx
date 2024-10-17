import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import type { BLOCK, Scripts } from '../types';
import styles from './ScriptEditor.module.css';
import { ScriptEditSpace } from './scriptEditSpace/ScriptEditSpace';
import { ScriptPalette } from './scriptPalette/ScriptPalette';

type Props = {
  scripts: Scripts;
  setScripts: Dispatch<SetStateAction<Scripts>>;
};
export const ScriptEditor = (props: Props) => {
  const [targetBlock, setTargetBlock] = useState<BLOCK | null>(null);
  const { scripts, setScripts } = props;
  return (
    <div className={styles.main}>
      <ScriptEditSpace scripts={scripts} setScripts={setScripts} targetBlock={targetBlock}>
        <ScriptPalette setTargetBlock={setTargetBlock} />
      </ScriptEditSpace>
    </div>
  );
};
