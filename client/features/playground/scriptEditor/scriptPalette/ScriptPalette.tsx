import { BLOCKS } from 'features/playground/constants';
import type { BLOCK } from 'features/playground/types';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';
import styles from '../ScriptEditor.module.css';

type Props = {
  setTargetBlock: Dispatch<SetStateAction<BLOCK | null>>;
};

export const ScriptPalette = (scriptPaletteProps: Props) => {
  const { setTargetBlock } = scriptPaletteProps;
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
          onDragStart={() => setTargetBlock(block)}
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
