import type { BLOCK, Block } from 'features/playground/types';
import { defaultBlock } from 'features/playground/utils/defaultBlock';
import { updateScriptValue } from 'features/playground/utils/updateScriptValue';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback } from 'react';

type ScriptState = {
  script: Block[];
  position: { x: number; y: number };
};
type UseScriptsProps = {
  targetBlock: BLOCK | null;
  targetPos: { x: number; y: number };
  scripts: ScriptState[];
  setScripts: Dispatch<SetStateAction<ScriptState[]>>;
  setTargetBlock: Dispatch<SetStateAction<BLOCK | null>>;
};

type UseScriptsReturn = {
  scripts: ScriptState[];
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleOnChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    scriptIndex: number,
    indexes: number[],
  ) => void;
  handleDropToInput: (
    e: React.DragEvent<HTMLElement>,
    scriptIndex: number,
    indexes: number[],
  ) => void;
  targetBlock: BLOCK | null;
};

export const useScripts = ({
  scripts,
  setScripts,
  targetBlock,
  setTargetBlock,
  targetPos,
}: UseScriptsProps): UseScriptsReturn => {
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!targetBlock) return;
      const containerRect = event.currentTarget.getBoundingClientRect();
      const current_X = event.clientX - containerRect.left;
      const current_Y = event.clientY - containerRect.top;
      const newScripts = structuredClone(scripts);
      newScripts.push({
        script: [{ ...defaultBlock(targetBlock) }],
        position: { x: current_X + targetPos.x, y: current_Y + targetPos.y },
      } as ScriptState);
      setScripts(newScripts);
    },
    [scripts, setScripts, targetBlock],
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, scriptIndex: number, indexes: number[]) => {
      const newScripts = structuredClone(scripts);
      updateScriptValue(e.target.value, newScripts[scriptIndex].script, indexes);
      setScripts(newScripts);
    },
    [scripts, setScripts],
  );

  const handleDropToInput = useCallback(
    (e: React.DragEvent<HTMLElement>, scriptIndex: number, indexes: number[]) => {
      if (targetBlock === null) return;

      const newScripts = structuredClone(scripts);
      updateScriptValue(defaultBlock(targetBlock), newScripts[scriptIndex].script, indexes);
      setScripts(newScripts);

      e.preventDefault();
      e.stopPropagation();
      setTargetBlock(null);
    },
    [scripts, setScripts, targetBlock],
  );

  return {
    scripts,
    handleDrop,
    handleDragOver,
    handleOnChange,
    handleDropToInput,
    targetBlock,
  };
};
