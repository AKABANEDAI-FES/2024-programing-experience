import * as React from 'react';
import styles from './Card.module.css';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`${styles.card} ${className || ''}`} {...props} />
  ),
);
Card.displayName = 'Card';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`${styles.cardContent} ${className || ''}`} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

export { Card, CardContent };
