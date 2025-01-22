import { AlignBox } from 'components/AlignBox';
import { useEffect, useRef, useState } from 'react';
import type { ScriptState, SpriteState } from '../types';
import { ControlBar } from './ControlBar/ControlBar';
import { useCollisionDetection } from './hooks/useCollisionDetection';
import { useScriptExecution } from './hooks/useScriptExecution';
import { Obstacles } from './Obstacles/Obstacles';
import styles from './Preview.module.css';
import { Sprite } from './Sprite/Sprite';

type Props = {
  scriptStates: ScriptState[];
  setScriptStates: (v: ScriptState[]) => void;
};

const OBSTACLES_POSES = [
  { x: 2, y: 0, type: 1 },
  { x: 4, y: 2, type: 1 },
  { x: 6, y: 2, type: 1 },
  { x: 8, y: 2, type: 1 },
  { x: 2, y: 4, type: 1 },
  { x: 8, y: 4, type: 1 },
  { x: 2, y: 6, type: 1 },
  { x: 4, y: 6, type: 1 },
  { x: 6, y: 6, type: 1 },
  { x: 8, y: 6, type: 1 },
  { x: 2, y: 8, type: 1 },
  { x: 4, y: 8, type: 1 },
  { x: 6, y: 8, type: 1 },
  { x: 8, y: 8, type: 0 },
];

const GRID_SEPARATE = 10;

export const Preview = ({ scriptStates, setScriptStates }: Props) => {
  const [stepSpeed, setStepSpeed] = useState(1);
  const [state, setState] = useState<SpriteState>({
    x: 0,
    y: 0,
    direction: 0,
  });
  const [gridSize, setGridSize] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const { handleStartButtonClick } = useScriptExecution(
    stepSpeed,
    scriptStates,
    setScriptStates,
    setState,
  );
  const { isGoaled, hasCollision } = useCollisionDetection(state, OBSTACLES_POSES, gridSize);

  useEffect(() => {
    const handleResize = () => {
      setGridSize((ref.current?.clientWidth ?? 0) / GRID_SEPARATE);
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setGridSize((ref.current?.clientWidth ?? 0) / GRID_SEPARATE);
  });
  console.log(state)
  return (
    <div className={styles.main}>
      <AlignBox x={'|..'}>
        <ControlBar
          isActive={scriptStates.some(({ active }) => active)}
          onStartButtonClick={handleStartButtonClick}
          onSpeedChange={(speed) => setStepSpeed(speed)}
          statusMessage={isGoaled ? '🎉 ゴール!' : hasCollision ? '💥 衝突!' : '🎮 プレイ中'}
        />
      </AlignBox>
      <div
        className={styles.preview}
        ref={ref}
        style={{
          gridTemplateAreas: `"${Array.from({ length: GRID_SEPARATE }, (_, i) =>
            Array.from({ length: GRID_SEPARATE }, (_, j) => `area${i}-${j}`).join(' '),
          ).join('" "')}"`,
        }}
      >
        <Sprite
          gridSize={gridSize}
          state={state}
          stepSpeed={stepSpeed}
          isGoaled={isGoaled}
          hasCollision={hasCollision}
        />
        <Obstacles obstaclePoses={OBSTACLES_POSES} />
      </div>
    </div>
  );
};
