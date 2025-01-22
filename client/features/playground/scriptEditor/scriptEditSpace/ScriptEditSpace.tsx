import { ScriptRoot } from 'features/playground/component/ScriptRoot/ScriptRoot';
import type { Scripts } from 'features/playground/types';
import { useScripts } from 'hooks/useScripts';
import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import type { Pos, SetTargetBlockType, TargetBlockType } from 'types';
import { resetEvent } from 'utils/resetEvent';
import styles from './ScriptEditSpace.module.css';

type Props = {
  scripts: Scripts;
  setScripts: (v: Scripts) => void;
  targetBlock: TargetBlockType;
  setTargetBlock: SetTargetBlockType;
  targetPos: { x: number; y: number };
  setTargetPos: Dispatch<SetStateAction<{ x: number; y: number }>>;
  children: React.ReactNode;
};

export const ScriptEditSpace = ({
  scripts,
  setScripts,
  targetBlock,
  setTargetBlock,
  targetPos,
  setTargetPos,
  children,
}: Props) => {
  const {
    handleDrop,
    handleDragOver,
    handleOnChange,
    handleDropToInput,
    handleDragStart,
    targetBlock: outTB,
  } = useScripts({
    scripts,
    setScripts,
    targetBlock,
    setTargetBlock,
    targetPos,
  });
  const calcHandleDropArg = (e: React.DragEvent): [Pos, Pos] => {
    const rect = e.currentTarget.getBoundingClientRect();
    return [
      { x: e.clientX, y: e.clientY },
      { x: rect.left, y: rect.top },
    ];
  };
  return (
    <div
      className={styles.scriptEditSpace}
      onDrop={resetEvent('p-', (e) => handleDrop(...calcHandleDropArg(e)))}
      onDragOver={resetEvent('ps', handleDragOver)}
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
            handleDragStart={handleDragStart}
            setTargetPos={setTargetPos}
            outTB={outTB}
          />
        </div>
      ))}
    </div>
  );
};
