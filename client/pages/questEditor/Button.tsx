import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'selected';
}

export const Button: React.FC<ButtonProps> = ({ className, variant = 'default', ...props }) => {
  const variantClass =
    variant === 'selected' ? styles.selected : styles[variant as 'default' | 'outline'];
  return <button className={`${styles.button} ${variantClass} ${className || ''}`} {...props} />;
};
