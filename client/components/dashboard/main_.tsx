import React, { useEffect } from 'react';
import styles from './dashboard.module.css';
import ArticleStats from './article_stats/article_stats';
import PerformanceUI from '../performance/performance';
import New from './article_stats/new';
import Link from 'next/link';

const Main = ({ user, posts, tips, pending, rejected }) => {
  useEffect(() => {
    const previous = document.querySelector('#previous') as HTMLDivElement;
    const next = document.querySelector('#next') as HTMLDivElement;
    const carousel = document.querySelector('#carousel') as HTMLDivElement;

    let index = 0;
    previous.addEventListener('click', (e: any) => {
      e.target.style.backgroundColor = '#fff';
      next.style.backgroundColor = '#000';
      index = index > -14 ? index - 1 : -14;
      carousel.style.transform = `translateX(${index * 30}px)`;
    });

    next.addEventListener('click', (e: any) => {
      e.target.style.backgroundColor = '#fff';
      previous.style.backgroundColor = '#000';
      index = index < 1 ? index + 1 : 1;
      carousel.style.transform = `translateX(${index * 30}px)`;
    });
  }, []);
  const numOfApprovedPosts = `${posts.length}`.padStart(2, '0');
  const numOfApprovedTips = `${tips.length}`.padStart(2, '0');
  const numOfPendingPosts = `${pending.length}`.padStart(2, '0');
  const numOfRejectedPosts = `${rejected.length}`.padStart(2, '0');
  return (
    <div className={styles.main__child}>
      <div className={styles.main__top}>
        <div className={styles.main__top__firstchild}>
          <PerformanceUI />
        </div>
        <div className={styles.chart}>Chart coming soon...</div>
      </div>

      <div className={styles.article_stats_wrapper}>
        <div className={styles.article_stats}>
          <div className={styles.article_stats_1}>
            <p>Engagement</p>
            <p>
              General statistics of your <strong>articles</strong>.
            </p>
          </div>
          <div className={styles.article_stats_2} id="carousel">
            <Link href="/dashboard/posts">
              <a>
                <ArticleStats
                  title="Posts"
                  figure={numOfApprovedPosts}
                  icon={
                    <i
                      className="fa-solid fa-bolt"
                      style={{ padding: '0.5px 0' }}></i>
                  }
                />
              </a>
            </Link>
            <Link href="/dashboard/tips">
              <a>
                <ArticleStats
                  title="Tips"
                  figure={numOfApprovedTips}
                  icon={
                    <i
                      className="fa-solid fa-star"
                      style={{
                        transform: 'rotate(45deg)',
                        fontSize: 8,
                        padding: '1px 0',
                      }}></i>
                  }
                />
              </a>
            </Link>
            <Link href="/dashboard/pendings">
              <a>
                <ArticleStats
                  title="Pending"
                  figure={numOfPendingPosts}
                  icon={
                    <i
                      className="fa-regular fa-hourglass-half"
                      style={{
                        transform: 'rotate(45deg)',
                        padding: '1px',
                      }}></i>
                  }
                />
              </a>
            </Link>
            <Link href="/dashboard/rejected-articles">
              <a>
                <ArticleStats
                  title="Rejected"
                  figure={numOfRejectedPosts}
                  icon={
                    <i
                      className="fa-solid fa-ban"
                      style={{ padding: '1px 0' }}></i>
                  }
                />
              </a>
            </Link>
            <New />
          </div>
        </div>
        <div className={styles.controls}>
          <span className={styles.back} id="previous"></span>
          <span className={styles.next} id="next"></span>
        </div>
      </div>
    </div>
  );
};

export default Main;
