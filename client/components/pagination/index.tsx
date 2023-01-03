import React from 'react';
import styles from './styles.module.css';

const Pagination = ({ items, currentPage, pageSize, onPageChange }) => {
  const pagesCount = Math.ceil(items / pageSize); // article.length / 2;

  if (pagesCount === 1) return null;
  const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);

  return (
    <div className={styles.pagination}>
      {pages.map((page) => (
        <button
          key={page}
          className={
            page === currentPage
              ? `${styles.page__item} ${styles.page__item__active}`
              : styles.page__item
          }
          onClick={() => onPageChange(page)}>
          {page}
        </button>
      ))}
    </div>
  );
};
export default Pagination;
