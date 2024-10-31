import React from 'react';
import styles from './Textarea.module.css';

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  className,
  ...props
}) => <textarea className={`${styles.textarea} ${className || ''}`} {...props} />;
