import React from 'react';
import styles from './Obstacles.module.css';

type Props = {
  obstaclePoses: (Partial<Pick<React.CSSProperties, 'backgroundColor' | 'border'>> & {
    x: number;
    y: number;
    type: number;
    backGroundImgURL?: string;
  })[];
};

export const Obstacles = ({ obstaclePoses }: Props) => {
  return (
    <>
      {obstaclePoses.map(({ backGroundImgURL, border, ...obstaclePos }, i) => (
        <div
          className={styles.obstacle}
          key={i}
          style={{
            display: 'flex',
            gridArea: `area${obstaclePos.y}-${obstaclePos.x}`,
            border,
            background: `url(${backGroundImgURL})`,
            backgroundColor: obstaclePos.type === 0 ? 'green' : 'red',
          }}
        />
      ))}
    </>
  );
};
