import React from 'react';
import styles from './notification.module.css';

const Line = ({ style }) => {
  return <div className={styles.line} style={style}></div>;
};

export default Line;
