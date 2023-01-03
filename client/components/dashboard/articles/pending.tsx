import React, { Key, useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import card from '../../post/post.module.css';
import Link from 'next/link';
import Pagination from '../../pagination';
import { paginate } from '../../../helpers';

const UserPendingUI = ({ pending }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedPending = paginate(pending, currentPage, pageSize);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper} aria-live="polite">
        <h5 className={styles.heading}>Your Pending Articles</h5>
        <div className={styles.main}>
          {typeof pending !== 'string'
            ? paginatedPending.map(
                (
                  pending: {
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
                  return (
                    <article
                      className={card.container}
                      id="pending"
                      key={index}>
                      <div className={card.head}>
                        <Link
                          href={`/dashboard/pending/${pending.slug}`}
                          as={`/dashboard/pending/${pending.slug}`}>
                          <a>
                            <img
                              src={pending.banner}
                              className={card.image}
                              alt="Pending Image"
                            />
                          </a>
                        </Link>
                      </div>
                      <div className={card.body}>
                        <Link href={`/dashboard/pendings/${pending.slug}`}>
                          <a>
                            <h3 className={card.title} id="pending-title">
                              {pending.title}
                            </h3>
                          </a>
                        </Link>

                        <p className={card.desc}>{pending.description}</p>
                        <p className={card.reading__time} id="reading-time">
                          {pending.readingTime}
                        </p>
                      </div>
                      <div className={card.categories}>
                        {pending.categories.map((category: any) => {
                          return (
                            <Link href={`/?cat=${category}`}>
                              <a>
                                <span
                                  className={card.tag}
                                  id="tag"
                                  key={category._id}>
                                  {category.toLowerCase()}
                                </span>
                              </a>
                            </Link>
                          );
                        })}
                      </div>
                      <div className={card.author} id="author">
                        <Link href={`/?user=${pending.author}`}>
                          <a>
                            <img
                              src={pending.avatar}
                              className={card.avatar}
                              alt="Profile Image"
                            />
                          </a>
                        </Link>
                        <time className={card.time}>
                          {new Date(pending.createdAt).toDateString().slice(4)}
                        </time>
                      </div>
                    </article>
                  );
                },
              )
            : ''}
        </div>
        <Pagination
          items={pending.length} // pending articles length
          currentPage={currentPage} // 1
          pageSize={pageSize} // pending articles per page
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default UserPendingUI;
