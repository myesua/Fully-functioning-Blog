import React from 'react';
import styles from './article_stats.module.css';

const ArticleStats = ({ title, figure, icon }: any) => {
  return (
    <div className={styles.card}>
      <span className={styles.icon}>{icon}</span>
      <div className={styles.content}>
        <span>{title}</span>
        <span>{figure}</span>
      </div>
    </div>
  );
};

export default ArticleStats;
