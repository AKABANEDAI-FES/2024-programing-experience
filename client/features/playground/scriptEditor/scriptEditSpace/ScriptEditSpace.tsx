import { ScriptRoot } from 'features/playground/component/ScriptRoot/ScriptRoot';
import type { BLOCK, Scripts } from 'features/playground/types';
import { useScripts } from 'hooks/useScripts';
import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import styles from './ScriptEditSpace.module.css';

type Props = {
  scripts: Scripts;
  setScripts: Dispatch<SetStateAction<Scripts>>;
  targetBlock: BLOCK | null;
  setTargetBlock: Dispatch<SetStateAction<BLOCK | null>>;
  targetPos: { x: number; y: number };
  children: React.ReactNode;
};

export const ScriptEditSpace = ({
  scripts,
  setScripts,
  targetBlock,
  setTargetBlock,
  targetPos,
  children,
}: Props) => {
  const {
    handleDrop,
    handleDragOver,
    handleOnChange,
    handleDropToInput,
    targetBlock: outTB,
  } = useScripts({
    scripts,
    setScripts,
    targetBlock,
    setTargetBlock,
    targetPos,
  });
  return (
    <div
      className={styles.scriptEditSpace}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ position: 'relative' }}
    >
      {children}
      {scripts.map((script, scriptIndex) => (
        <div
          key={scriptIndex}
          style={{
            position: 'absolute',
            left: `${script.position.x}px`,
            top: `${script.position.y}px`,
          }}
        >
          <ScriptRoot
            key={scriptIndex}
            arg={script.script}
            scriptIndex={scriptIndex}
            indexes={[]}
            targetBlock={targetBlock}
            isNotShadow={true}
            handleOnChange={handleOnChange}
            handleDrop={handleDropToInput}
            outTB={outTB}
          />
        </div>
      ))}
    </div>
  );
};
