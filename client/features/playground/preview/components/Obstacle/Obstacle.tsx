import React from 'react';
import styles from './Obstacle.module.css';

type Props = Partial<Pick<React.CSSProperties, 'backgroundColor' | 'border'>> & {
  backGroundImgURL?: string;
};

export const Obstacle = ({ backgroundColor, border, backGroundImgURL }: Props) => {
  return (
    <div
      className={styles.obstacle}
      style={{
        backgroundColor,
        border,
        background: `url(${backGroundImgURL})`,
      }}
    />
  );
};
