import styles from './Controls.module.css';

type ControlsProps = {
  isActive: boolean;
  onStartButtonClick: () => void;
  onSpeedChange: (speed: number) => void;
  statusMessage: string;
};

export const Controls = ({
  isActive,
  onStartButtonClick,
  onSpeedChange,
  statusMessage,
}: ControlsProps) => (
  <div>
    <button
      className={isActive ? styles.stopButton : styles.startButton}
      onClick={onStartButtonClick}
    >
      {isActive ? 'Stop' : 'Start'}
    </button>
    <input
      type="range"
      min={1}
      defaultValue={10}
      max={20}
      onChange={(e) => {
        onSpeedChange(2 - Number(e.target.value) / 10);
      }}
    />
    <div>{statusMessage}</div>
  </div>
);
