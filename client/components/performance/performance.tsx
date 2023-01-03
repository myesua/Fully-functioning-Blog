import React from 'react';
import styles from './performance.module.css';

const PerformanceUI = () => {
  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span>Performance</span>
        <span className={styles.colon}>:</span>
      </div>
      <div className={styles.card__stats}>
        <div className={styles.card__stats__content}>
          <span>70%</span>
          <span className={styles.card__stats__text}>Content</span>
        </div>
        <div className={styles.card__stats__quality}>
          <span>85%</span>
          <span className={styles.card__stats__text}>Quality</span>
        </div>
      </div>
      <div className={styles.card__stats__details}>
        <span>
          <i className="fa-solid fa-check"></i>
          <span>
            Content
            <span className={styles.card__stats__details__fade}>verified</span>
          </span>
        </span>
        <span>
          <i className="fa-solid fa-check"></i>
          <span>
            Quality
            <span className={styles.card__stats__details__fade}>checked</span>
          </span>
        </span>
        <span>
          <i className="fa-solid fa-check"></i>
          <span>
            Author
            <span className={styles.card__stats__details__fade}>approved</span>
          </span>
        </span>
      </div>
    </div>
  );
};

export default PerformanceUI;
