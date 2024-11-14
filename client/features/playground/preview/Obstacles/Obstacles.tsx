import React from 'react';
import styles from './Obstacles.module.css';

type Props = Partial<Pick<React.CSSProperties, 'backgroundColor' | 'border'>> & {
  backGroundImgURL?: string;
};

export const Obstacles = ({ backgroundColor, border, backGroundImgURL }: Props) => {
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
