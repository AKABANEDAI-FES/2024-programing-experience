import { AlignBox } from 'components/AlignBox';
import { useEffect, useState } from 'react';
import { moves } from '../constants';
import type { Block, blockArg, Scripts, ScriptState, SpriteState } from '../types';
import styles from './Preview.module.css';
import { Controls } from './components/Controls/Controls';
import { Goal } from './components/Goal/Goal';
import { Obstacle } from './components/Obstacle/Obstacle';
import { Sprite } from './components/Sprite/Sprite';

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
  const [stepSpeed, setStepSpeed] = useState(1);
  const [hasReachedGoal, setHasReachedGoal] = useState(false);
  const [collisions, setCollisions] = useState<boolean>(false);
  const [obstacles] = useState([
    { x: 100, y: 100, width: 50, height: 50 },
    { x: 200, y: 200, width: 50, height: 50 },
  ]);

  const [scriptStates, setScriptStates] = useState<ScriptState[]>(
    scripts?.map(({ script }) => defaultScriptState(script)),
  );
  const [state, setState] = useState<SpriteState>({
    x: 0,
    y: 0,
    direction: 0,
  });

  const goal = {
    x: 590,
    y: 480,
    width: 50,
    height: 50,
  };

  const updateScriptState = (updateFn: (newScriptStates: ScriptState[]) => void) => {
    const newScriptStates = structuredClone(scriptStates);
    updateFn(newScriptStates);
    setScriptStates([...newScriptStates]);
  };

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

  const intervalId = ({ script, active, stepDelay, stepCount }: ScriptState, i: number) => {
    if (active) {
      return setInterval(() => interval(i, script, stepCount), (stepDelay ?? stepSpeed) * 1000);
    }
    return undefined;
  };

  useEffect(() => {
    const intervalIds = scriptStates.map(intervalId);
    return () => {
      intervalIds?.forEach((intervalId) => clearInterval(intervalId));
    };
  }, [scriptStates, stepSpeed]);

  const handleStartButtonClick = () => {
    setScriptStates(
      scriptStates
        .filter(({ script }) => script[0]?.id === 0)
        .map((scriptState) => ({ ...scriptState, active: !scriptState.active, stepDelay: 0 })),
    );
  };

  useEffect(() => {
    const spriteSize = 30;
    //eslint-disable-next-line complexity
    const checkCollisionAndGoal = () => {
      const spriteRect = {
        left: state.x,
        right: state.x + spriteSize,
        top: state.y,
        bottom: state.y + spriteSize,
      };

      const hasCollision = obstacles.some(
        (obstacle) =>
          !(
            spriteRect.left > obstacle.x + obstacle.width ||
            spriteRect.right < obstacle.x ||
            spriteRect.top > obstacle.y + obstacle.height ||
            spriteRect.bottom < obstacle.y
          ),
      );

      const reachedGoal = !(
        spriteRect.left > goal.x + goal.width ||
        spriteRect.right < goal.x ||
        spriteRect.top > goal.y + goal.height ||
        spriteRect.bottom < goal.y
      );

      if (hasCollision) {
        setCollisions(true);
        setState({ x: 0, y: 0, direction: 0 });
        setScriptStates((prevStates) => prevStates.map((state) => ({ ...state, active: false })));
      } else {
        setCollisions(false);
      }

      if (reachedGoal) {
        setHasReachedGoal(true);
        setScriptStates((prevStates) => prevStates.map((state) => ({ ...state, active: false })));
      }
    };

    const checkInterval = setInterval(checkCollisionAndGoal, 100);
    return () => clearInterval(checkInterval);
  }, [state, obstacles]);

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
