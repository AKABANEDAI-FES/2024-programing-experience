import { Block } from 'features/playground/component/Block/Block';
import { BLOCKS } from 'features/playground/constants';
import type { BLOCK } from 'features/playground/types';
import { defaultBlock } from 'features/playground/utils/defaultBlock';
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

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>, n: number, i: number) => {
    const newBLOCKS = structuredClone(blocks);
    newBLOCKS[n].contents[i] = `$${e.target.value}`;

    setBLOCKS_useState(newBLOCKS);
  };
  return (
    <div className={styles.scriptPalette} onDrop={resetEvent('-s')}>
      {blocks.map((block, n) => (
        <div className={styles.scriptPaletteBlockWrapper} key={block.id}>
          <div
            draggable
            onDragStart={(e) => {
              setTargetBlock(block);
              setTargetPos({
                x: (e.target as HTMLDivElement).getBoundingClientRect().left - e.clientX,
                y: (e.target as HTMLDivElement).getBoundingClientRect().top - e.clientY,
              });
            }}
          >
            <Block
              arg={defaultBlock(block)}
              indexes={[]}
              isNotShadow={true}
              dragOverChildElement={() => {}}
              props={{
                arg: undefined,
                indexes: [],
                isNotShadow: true,
                scriptIndex: 0,
                targetBlock: null,
                handleOnChange: () => {},
                handleDrop: () => {},
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
