import { AlignBox } from 'components/AlignBox';
import { useEffect, useState } from 'react';
import { moves } from '../constants';
import type { Block, blockArg, Scripts, ScriptState, SpriteState } from '../types';
import styles from './Preview.module.css';
import { Controls } from './components/Controls/Controls';
import { Goal } from './components/Goal/Goal';
import { Obstacle } from './components/Obstacle/Obstacle';
import { Sprite } from './components/Sprite/Sprite';
import { useCollisionDetection } from './hooks/useCollisionDetection';

type Props = {
  scripts: Scripts;
};

const defaultScriptState = (script: Block[]) => ({
  script,
  active: false,
  stepDelay: 0,
  stepCount: [0],
  loopCount: [0],
  nestStatus: [true],
});

export const Preview = (props: Props) => {
  const { scripts } = props;

  // ステート管理
  const [stepSpeed, setStepSpeed] = useState(1);

  const [scriptStates, setScriptStates] = useState<ScriptState[]>(
    scripts?.map(({ script }) => defaultScriptState(script)),
  );

  const [state, setState] = useState<SpriteState>({
    x: 0,
    y: 0,
    direction: 0,
  });

  // カスタムフックによる衝突とゴール判定
  const { hasReachedGoal, collisions } = useCollisionDetection(state);

  // スクリプト状態更新関数
  const updateScriptState = (updateFn: (newScriptStates: ScriptState[]) => void) => {
    const newScriptStates = structuredClone(scriptStates);
    updateFn(newScriptStates);
    setScriptStates([...newScriptStates]);
  };

  // スクリプト実行関数
  const interval = (i: number, script: Block[], stepCount: number[]) => {
    if (stepCount[0] >= script.length) {
      updateScriptState((scriptStates) => {
        scriptStates[i] = defaultScriptState(scriptStates[i].script);
      });
      return;
    }

    const block = script?.[stepCount[0]];

    if (block === undefined) return;

    updateScriptState((scriptStates) => {
      const step = (block: blockArg): void | string | undefined => {
        if (typeof block === 'string') {
          return block;
        }
        if (block instanceof Array) return;
        return moves(step, block.arg, scriptStates[i], 0, setState)[block.id]?.();
      };
      step(block);
      scriptStates[i].stepCount[scriptStates[i].stepCount.length - 1] += 1;
    });
  };

  // インターバルID管理関数
  const intervalId = ({ script, active, stepDelay, stepCount }: ScriptState, i: number) => {
    if (active) {
      return setInterval(() => interval(i, script, stepCount), (stepDelay ?? stepSpeed) * 1000);
    }
    return undefined;
  };

  // スクリプト実行タイミングの管理（useEffectフック）
  useEffect(() => {
    const intervalIds = scriptStates.map(intervalId);

    return () => intervalIds?.forEach((intervalId) => clearInterval(intervalId));
  }, [scriptStates, stepSpeed]);

  // スタートボタン押下時の処理
  const handleStartButtonClick = () => {
    setScriptStates(
      scriptStates
        .filter(({ script }) => script[0]?.id === 0)
        .map((scriptState) => ({
          ...scriptState,
          active: !scriptState.active,
          stepDelay: 0,
        })),
    );
  };

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
