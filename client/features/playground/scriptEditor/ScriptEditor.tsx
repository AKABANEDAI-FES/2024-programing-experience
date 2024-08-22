import type { Dispatch, SetStateAction } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { BLOCKS, BLOCKS_DICT } from '../constants';
import type { BLOCK, Block } from '../types';
import styles from './ScriptEditor.module.css';
type ScriptPaletteProps = {
  setTargetBlock: Dispatch<SetStateAction<BLOCK | null>>;
};
const ScriptPalette = (scriptPaletteProps: ScriptPaletteProps) => {
  const { setTargetBlock: setTargetBlockId } = scriptPaletteProps;
  // @ts-expect-error TS2322
  const [blocks, setBLOCKS_useState] = useState<BLOCK[]>(BLOCKS);
  const ref = useRef<HTMLInputElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  });
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>, n: number, i: number) => {
    const newBLOCKS = structuredClone(blocks);
    newBLOCKS[n].contents[i] = `$${e.target.value}`;

    setBLOCKS_useState(newBLOCKS);
  };
  return (
    <div className={styles.scriptPalette}>
      {blocks.map((block, n) => (
        <div
          key={block.id}
          className={styles.block}
          draggable
          onDragStart={() => setTargetBlockId(block)}
        >
          {block.contents.map((content, i) =>
            content.startsWith('$') ? (
              <input
                className={styles.input}
                key={i}
                type="text"
                defaultValue={10}
                onChange={(e) => handleOnChange(e, n, i)}
              />
            ) : (
              <div key={i}>{content}</div>
            ),
          )}
        </div>
      ))}
    </div>
  );
};

type ScriptEditSpaceProps = {
  script: Block[] | undefined;
  setScript: Dispatch<SetStateAction<Block[] | undefined>>;
  targetBlock: BLOCK | null;
};

const ScriptEditSpace = (scriptEditSpaceProps: ScriptEditSpaceProps) => {
  const { script, setScript, targetBlock: targetBlock } = scriptEditSpaceProps;

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (targetBlock === null) return;
    const newScript = structuredClone(script ?? []);
    console.log(targetBlock);
    newScript.push({
      id: targetBlock.id,
      arg: targetBlock.contents
        .filter((content) => content.startsWith('$'))
        .map((content) => content.replace('$', '')),
    });
    setScript(newScript);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    n: number,
    i: number,
    contents: string[],
  ) => {
    const newScript = structuredClone(script ?? []);
    newScript[n].arg[contents.slice(0, i).filter((content) => content.startsWith('$')).length] =
      e.target?.value ?? '';

    setScript(newScript);
  };

  return (
    <div className={styles.scriptEditSpace} onDrop={handleDrop} onDragOver={handleDragOver}>
      {script?.map((block, n) => (
        <div className={styles.block}>
          {BLOCKS_DICT[block.id]?.contents.map((content, i, contents) =>
            content.startsWith('$') ? (
              <input
                className={styles.input}
                key={i}
                type="text"
                defaultValue={
                  block.arg[
                    contents.slice(0, i).filter((content) => content.startsWith('$')).length
                  ] as string
                }
                onChange={(e) => handleOnChange(e, n, i, contents)}
              />
            ) : (
              <div key={i}>{content}</div>
            ),
          )}
        </div>
      ))}
    </div>
  );
};

type Props = {
  script: Block[] | undefined;
  setScript: Dispatch<SetStateAction<Block[] | undefined>>;
};
export const ScriptEditor = (props: Props) => {
  const [targetBlock, setTargetBlockId] = useState<BLOCK | null>(null);
  const { script, setScript } = props;
  return (
    <div className={styles.main}>
      <ScriptPalette setTargetBlock={setTargetBlockId} />
      <ScriptEditSpace script={script} setScript={setScript} targetBlock={targetBlock} />
    </div>
  );
};
