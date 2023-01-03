import React, { Key, useState } from 'react';
import styles from './styles.module.css';
import Link from 'next/link';
import Rejected from '../../rejected';
import Pagination from '../../pagination';
import { paginate } from '../../../helpers';

const UserRejectedUI = ({ rejected }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedRejected = paginate(rejected, currentPage, pageSize);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper} aria-live="polite">
        <h5 className={styles.heading}>Your Rejected Articles</h5>
        <div className={styles.main}>
          {typeof rejected !== 'string'
            ? paginatedRejected.map((a: { title: string }, index: Key) => {
                let slug = a.title.toLowerCase().split(' ').join('-');
                return (
                  <Link href={`/article/${slug}`} key={index}>
                    <a className={styles.post}>
                      <Rejected a={a} />
                    </a>
                  </Link>
                );
              })
            : ''}
        </div>
        <Pagination
          items={rejected.length} // rejected articles length
          currentPage={currentPage} // 1
          pageSize={pageSize} // rejected articles per page
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default UserRejectedUI;
