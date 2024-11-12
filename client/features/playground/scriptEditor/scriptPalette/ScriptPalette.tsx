import { Block } from 'features/playground/component/Block/Block';
import { BLOCKS } from 'features/playground/constants';
import type { BLOCK } from 'features/playground/types';
import { defaultBlock } from 'features/playground/utils/defaultBlock';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import type { SetTargetBlockType } from 'types';
import { resetEvent } from 'utils/resetEvent';
import styles from '../ScriptEditor.module.css';

type Props = {
  setTargetBlock: SetTargetBlockType;
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
      {blocks.map((block) => (
        <div className={styles.scriptPaletteBlockWrapper} key={block.id}>
          <div
            draggable
            onDragStart={resetEvent('-s', (e) => {
              setTargetBlock([defaultBlock(block)]);
              setTargetPos({
                x: (e.target as HTMLDivElement).getBoundingClientRect().left - e.clientX,
                y: (e.target as HTMLDivElement).getBoundingClientRect().top - e.clientY,
              });
            })}
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
                handleDragStart: () => {},
                setTargetPos: () => {},
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
