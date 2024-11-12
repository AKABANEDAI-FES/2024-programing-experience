import { AlignBox } from 'components/AlignBox';
import { useState } from 'react';
import type { Scripts, SpriteState } from '../types';
import styles from './Preview.module.css';
import { Controls } from './components/Controls/Controls';
import { Goal } from './components/Goal/Goal';
import { Obstacle } from './components/Obstacle/Obstacle';
import { Sprite } from './components/Sprite/Sprite';
import { useCollisionDetection } from './hooks/useCollisionDetection';
import { useScriptExecution } from './hooks/useScriptExecution';

type Props = {
  scripts: Scripts;
};

export const Preview = (props: Props) => {
  const { scripts } = props;

  const [stepSpeed, setStepSpeed] = useState(1);
  const [state, setState] = useState<SpriteState>({
    x: 0,
    y: 0,
    direction: 0,
  });
  const blocks = scripts.map((scriptObj) => scriptObj.script);
  const { scriptStates, handleStartButtonClick } = useScriptExecution(blocks, setState);
  const { hasReachedGoal, collisions } = useCollisionDetection(state);

  return (
    <div className={styles.main}>
      <AlignBox x={'|..'}>
        <Controls
          isActive={scriptStates.some(({ active }) => active)}
          onStartButtonClick={handleStartButtonClick}
          onSpeedChange={(speed) => setStepSpeed(speed)}
          statusMessage={hasReachedGoal ? '🎉 ゴール!' : collisions ? '💥 衝突!' : '🎮 プレイ中'}
        />
      </AlignBox>
      <div className={styles.preview}>
        <Sprite
          state={state}
          stepSpeed={stepSpeed}
          hasReachedGoal={hasReachedGoal}
          collisions={collisions}
        />
        <Obstacle />
        <Goal />
      </div>
    </div>
  );
};
