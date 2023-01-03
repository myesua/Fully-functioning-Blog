import React from 'react';
import styles from './article_stats.module.css';

const New = () => {
  return (
    <div className={styles.card__2} id="write-icon">
      <div className={styles.content}>
        <span className={styles.card__2__text}>Write New Article</span>
        <span className={styles.card__2__icon}>
          <i className="fa-solid fa-circle-arrow-right"></i>
        </span>
      </div>
    </div>
  );
};

export default New;
