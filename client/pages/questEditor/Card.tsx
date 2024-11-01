import React from 'react';
import styles from '../questEditor/Card.module.css';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={`${styles.card} ${className || ''}`} {...props} />
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={`${styles.cardHeader} ${className || ''}`} {...props} />;

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => <h3 className={`${styles.cardTitle} ${className || ''}`} {...props} />;

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={`${styles.cardContent} ${className || ''}`} {...props} />;
