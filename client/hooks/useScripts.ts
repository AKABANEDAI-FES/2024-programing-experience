import type { BlockT } from 'features/playground/types';
import { deleteScript } from 'features/playground/utils/deleteScriptValue';
import { updateScriptValue } from 'features/playground/utils/updateScriptValue';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback } from 'react';
import type { Pos, SetTargetBlockType, TargetBlockType } from 'types';

type ScriptState = {
  script: BlockT[];
  position: { x: number; y: number };
};
type UseScriptsProps = {
  targetBlock: TargetBlockType;
  targetPos: { x: number; y: number };
  scripts: ScriptState[];
  setScripts: Dispatch<SetStateAction<ScriptState[]>>;
  setTargetBlock: SetTargetBlockType;
};

type UseScriptsReturn = {
  scripts: ScriptState[];
  handleDrop: (clientPos: Pos, rectPos: Pos) => void;
  handleDragOver: () => void;
  handleOnChange: (inputValue: string, scriptIndex: number, indexes: number[]) => void;
  handleDropToInput: (scriptIndex: number, indexes: number[]) => void;
  handleDragStart: (scriptIndex: number, indexes: number[]) => void;
  targetBlock: TargetBlockType;
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

  const handleDragStart = useCallback(
    (scriptIndex: number, indexes: number[]) => {
      const [newScripts, newTarget] = deleteScript(scripts[scriptIndex].script, indexes);
      setTimeout(() => {
        setScripts(
          scripts.map((s, i) =>
            i === scriptIndex ? { ...scripts[scriptIndex], script: newScripts } : s,
          ),
        );
        setTargetBlock(newTarget);
      });
    },
    [scripts, setScripts, setTargetBlock],
  );

  return {
    scripts,
    handleDrop,
    handleDragOver,
    handleOnChange,
    handleDropToInput,
    handleDragStart,
    targetBlock,
  };
};
