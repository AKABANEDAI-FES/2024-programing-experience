import type { BlockT } from 'features/playground/types';
import { updateScriptValue } from 'features/playground/utils/updateScriptValue';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback } from 'react';
import type { Pos } from 'types';

type ScriptState = {
  script: BlockT[];
  position: { x: number; y: number };
};
type UseScriptsProps = {
  targetBlock: BlockT[] | null;
  targetPos: { x: number; y: number };
  scripts: ScriptState[];
  setScripts: Dispatch<SetStateAction<ScriptState[]>>;
  setTargetBlock: Dispatch<SetStateAction<BlockT[] | null>>;
};

type UseScriptsReturn = {
  scripts: ScriptState[];
  handleDrop: (clientPos: Pos, rectPos: Pos) => void;
  handleDragOver: () => void;
  handleOnChange: (inputValue: string, scriptIndex: number, indexes: number[]) => void;
  handleDropToInput: (scriptIndex: number, indexes: number[]) => void;
  targetBlock: BlockT[] | null;
};

export const useScripts = ({
  scripts,
  setScripts,
  targetBlock,
  setTargetBlock,
  targetPos,
}: UseScriptsProps): UseScriptsReturn => {
  const handleDrop = useCallback(
    (clientPos: Pos, rectPos: Pos) => {
      console.log(targetBlock);
      if (!targetBlock) return;
      const current_X = clientPos.x - rectPos.x;
      const current_Y = clientPos.y - rectPos.y;
      const newScripts = structuredClone(scripts);
      newScripts.push({
        script: targetBlock,
        position: { x: current_X + targetPos.x, y: current_Y + targetPos.y },
      } as ScriptState);
      setScripts(newScripts);
    },
    [scripts, setScripts, targetBlock],
  );

  const handleDragOver = useCallback(() => {}, []);

  const handleOnChange = useCallback(
    (inputValue: string, scriptIndex: number, indexes: number[]) => {
      const newScripts = structuredClone(scripts);
      updateScriptValue(inputValue, newScripts[scriptIndex].script, indexes);
      setScripts(newScripts);
    },
    [scripts, setScripts],
  );

  const handleDropToInput = useCallback(
    (scriptIndex: number, indexes: number[]) => {
      if (targetBlock === null) return;

      const newScripts = structuredClone(scripts);
      updateScriptValue(targetBlock, newScripts[scriptIndex].script, indexes);
      setScripts(newScripts);

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
