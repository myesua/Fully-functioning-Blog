import React, { Key, useState } from 'react';
import styles from './styles.module.css';
import card from '../../tip/tip.module.css';
import Link from 'next/link';
import Tip from '../../tip/tip';
import Pagination from '../../pagination';
import { paginate } from '../../../helpers';

const UserTipsUI = ({ tips }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedTips = paginate(tips, currentPage, pageSize);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper} aria-live="polite">
        <h5 className={styles.heading}>Your Tips</h5>
        <div className={styles.main}>
          {typeof tips !== 'string'
            ? paginatedTips.map(
                (
                  tip: {
                    _id: string;
                    slug: string;
                    banner: string;
                    description: string;
                    readingTime: string;
                    categories: any;
                    author: string;
                    avatar: string;
                    createdAt: string | number | Date;
                    title: string;
                  },
                  index: Key,
                ) => {
                  let slug = tip.title.toLowerCase().split(' ').join('-');
                  return (
                    <div className={card.tip} key={index}>
                      <header className={card.tipheader}>
                        <span>
                          <Link href={`/dashboard/tip/${tip.slug}`}>
                            <a>🔧</a>
                          </Link>
                        </span>
                        <span>
                          <Link href={`/dashboard/tip/${tip.slug}`}>
                            <a>Tips</a>
                          </Link>
                        </span>
                      </header>
                      <main className={card.tipbody}>
                        <h3 className={card.tiptitle}>
                          <Link href={`/dashboard/tip/${tip.slug}`}>
                            <a>{tip.title}</a>
                          </Link>
                        </h3>
                        <p className={card.desc}>{tip.description}</p>
                      </main>
                      <footer className={card.tipauthor}>
                        <Link href={`/?user=${tip.author}`}>
                          <a>
                            <img
                              src={tip.avatar}
                              className={card.avatar}
                              alt="Profile Image"
                            />
                          </a>
                        </Link>
                        <time>{new Date(tip.createdAt).toDateString()}</time>
                      </footer>
                    </div>
                  );
                },
              )
            : ''}
        </div>
        <Pagination
          items={tips.length} // tips length
          currentPage={currentPage} // 1
          pageSize={pageSize} // tips per page
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default UserTipsUI;
