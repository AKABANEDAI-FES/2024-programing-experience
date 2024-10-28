import type { BLOCK, Block, blockArg } from 'features/playground/types';
import { defaultBlock } from 'features/playground/utils/defaultBlock';
import { updateScriptValue } from 'features/playground/utils/updateScriptValue';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useState } from 'react';

type ScriptState = {
  script: Block[];
  position: { x: number; y: number };
};

type UseScriptsProps = {
  targetBlock: BLOCK | null;
  targetPos: { x: number; y: number };
  scripts: ScriptState[];
  setScripts: Dispatch<SetStateAction<ScriptState[]>>;
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
  handleDetachBlock: (
    scriptIndex: number,
    indexes: number[],
    position: { x: number; y: number },
  ) => void;
};

export const useScripts = ({
  scripts,
  setScripts,
  targetBlock,
  targetPos,
}: UseScriptsProps): UseScriptsReturn => {
  const [draggingBlockId, setDraggingBlockId] = useState<number | null>(null);
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (draggingBlockId !== null) {
        setDraggingBlockId(null);
        return;
      }
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
    [scripts, setScripts, targetBlock, targetPos],
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
      if (draggingBlockId !== null) {
        return;
      }
      if (targetBlock === null) return;

      const newScripts = structuredClone(scripts);
      updateScriptValue(defaultBlock(targetBlock), newScripts[scriptIndex].script, indexes);
      setScripts(newScripts);

      e.preventDefault();
      e.stopPropagation();
    },
    [scripts, setScripts, targetBlock],
  );

  const handleDetachBlock = useCallback(
    //eslint-disable-next-line complexity
    (scriptIndex: number, indexes: number[], position: { x: number; y: number }) => {
      const newScripts = structuredClone(scripts);
      const targetScript = newScripts[scriptIndex];

      let currentBlock: Block[] | Block = targetScript.script;
      let parentBlock: Block[] | Block | null = null;
      let lastIndex = -1;

      //ブロックを切り離す処理s
      for (let i = 0; i < indexes.length; i++) {
        if (i === indexes.length - 1) {
          parentBlock = currentBlock;
          lastIndex = indexes[i];
        }

        if (Array.isArray(currentBlock)) {
          currentBlock = currentBlock[indexes[i]];
        } else if (typeof currentBlock === 'object' && currentBlock.arg) {
          currentBlock = currentBlock.arg[indexes[i]] as Block;
        }
      }

      let detachedBlock: Block | undefined;

      //既存のブロックを消すための機能
      if (Array.isArray(parentBlock)) {
        detachedBlock = structuredClone(parentBlock[lastIndex]);
        parentBlock.splice(lastIndex, 1);
      } else if (parentBlock && 'arg' in parentBlock) {
        detachedBlock = structuredClone(parentBlock.arg[lastIndex] as Block);
        parentBlock.arg[lastIndex] = '' as blockArg;
      }

      if (targetScript.script.length === 0) {
        newScripts.splice(scriptIndex, 1);
      }

      setScripts(newScripts);
    },
    [scripts, setScripts],
  );

  return {
    scripts,
    handleDrop,
    handleDragOver,
    handleOnChange,
    handleDropToInput,
    handleDetachBlock,
  };
};
