import type { Block } from 'common/types/playground';
import { useState } from 'react';
import styles from './Playground.module.css';
import { Preview } from './preview/Preview';
import { ScriptEditor } from './scriptEditor/ScriptEditor';
import type { Scripts, ScriptState } from './types';

const defaultScriptState = (script: Block[]) => ({
  script,
  active: false,
  stepDelay: 0,
  stepCount: [0],
  loopCount: [0],
  nestStatus: [true],
});

export const Playground = () => {
  const [scripts, setScripts] = useState<(Scripts[number] & ScriptState)[]>([]);
  const setScriptPoses = (newScripts: Scripts) => {
    setScripts((prev) =>
      newScripts
        .map((s, i) => ({ ...prev[i], ...s, ...defaultScriptState(s.script) }))
        .filter((s) => s.script.length > 0),
    );
  };

  const setScriptStates = (newScripts: ScriptState[]) => {
    setScripts((prev) => newScripts.map((s, i) => ({ ...prev[i], ...s })));
  };
  return (
    <div className={styles.main}>
      <ScriptEditor scripts={scripts} setScripts={setScriptPoses} />
      <Preview scriptStates={scripts} setScriptStates={setScriptStates} />
    </div>
  );
};
