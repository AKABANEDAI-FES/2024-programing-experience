import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import type { BLOCK, Block } from '../types';
import styles from './ScriptEditor.module.css';
import { ScriptEditSpace } from './scriptEditSpace/ScriptEditSpace';
import { ScriptPalette } from './scriptPalette/ScriptPalette';

type Props = {
  script: Block[] | undefined;
  setScript: Dispatch<SetStateAction<Block[] | undefined>>;
};
export const ScriptEditor = (props: Props) => {
  const [targetBlock, setTargetBlock] = useState<BLOCK | null>(null);
  const { script, setScript } = props;
  return (
    <div className={styles.main}>
      <ScriptPalette setTargetBlock={setTargetBlock} />
      <ScriptEditSpace script={script} setScript={setScript} targetBlock={targetBlock} />
    </div>
  );
};
