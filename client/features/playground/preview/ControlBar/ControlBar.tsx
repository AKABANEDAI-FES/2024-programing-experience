import styles from './ControlBar.module.css';

type Props = {
  isActive: boolean;
  onStartButtonClick: () => void;
  onSpeedChange: (speed: number) => void;
  statusMessage: string;
};

export const ControlBar = ({
  isActive,
  onStartButtonClick,
  onSpeedChange,
  statusMessage,
}: Props) => (
  <>
    <button
      className={isActive ? styles.stopButton : styles.startButton}
      onClick={onStartButtonClick}
    />
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
  </>
);
