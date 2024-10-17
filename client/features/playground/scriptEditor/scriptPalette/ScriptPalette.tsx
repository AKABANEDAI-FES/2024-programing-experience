import { Input } from 'features/playground/compornent/Input';
import { BLOCKS } from 'features/playground/constants';
import type { BLOCK } from 'features/playground/types';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { resetEvent } from 'utils/resetEvent';
import styles from '../ScriptEditor.module.css';

type Props = {
  setTargetBlock: Dispatch<SetStateAction<BLOCK | null>>;
  setTargetPos: Dispatch<SetStateAction<{ x: number; y: number }>>;
};

export const ScriptPalette = (props: Props) => {
  const { setTargetBlock, setTargetPos } = props;
  // @ts-expect-error TS2322
  const [blocks, setBLOCKS_useState] = useState<BLOCK[]>(BLOCKS);

  const _handleOnChange = (e: React.ChangeEvent<HTMLInputElement>, n: number, i: number) => {
    const newBLOCKS = structuredClone(blocks);
    newBLOCKS[n].contents[i] = `$${e.target.value}`;

    setBLOCKS_useState(newBLOCKS);
  };
  return (
    <div className={styles.scriptPalette} onDrop={resetEvent('-s')}>
      {blocks.map((block) => (
        <div className={styles.scriptPaletteBlockWrapper} key={block.id}>
          <div
            className={styles.block}
            draggable
            onDragStart={(e) => {
              setTargetBlock(block);
              setTargetPos({
                x: (e.target as HTMLDivElement).getBoundingClientRect().left - e.clientX,
                y: (e.target as HTMLDivElement).getBoundingClientRect().top - e.clientY,
              });
            }}
          >
            {block.contents.map((content, i) =>
              content instanceof Array ? (
                <Input key={i} defaultValue={''} />
              ) : content.startsWith('$') ? (
                <Input key={i} defaultValue={content.replace('$', '')} />
              ) : (
                <div key={i}>{content}</div>
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
