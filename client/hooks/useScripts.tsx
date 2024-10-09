import type { BLOCK, Block } from 'features/playground/types';
import { defaultBlock } from 'features/playground/utils/defaultBlock';
import { updateScriptValue } from 'features/playground/utils/updateScriptValue';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback } from 'react';

type UseScriptsProps = {
  scripts: Block[][];
  setScripts: Dispatch<SetStateAction<Block[][]>>;
  targetBlock: BLOCK | null;
};

export const useScripts = ({ scripts, setScripts, targetBlock }: UseScriptsProps) => {
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (targetBlock === null) return;

      const newScripts = structuredClone(scripts);
      newScripts.push([defaultBlock(targetBlock)]);
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
      updateScriptValue(e.target.value, newScripts[scriptIndex], indexes);
      setScripts(newScripts);
    },
    [scripts, setScripts],
  );

  const handleDropToInput = useCallback(
    (e: React.DragEvent<HTMLElement>, scriptIndex: number, indexes: number[]) => {
      if (targetBlock === null) return;

      const newScripts = structuredClone(scripts);
      updateScriptValue(defaultBlock(targetBlock), newScripts[scriptIndex], indexes);
      setScripts(newScripts);

      e.preventDefault();
      e.stopPropagation();
    },
    [scripts, setScripts, targetBlock],
  );

  return {
    handleDrop,
    handleDragOver,
    handleOnChange,
    handleDropToInput,
  };
};
