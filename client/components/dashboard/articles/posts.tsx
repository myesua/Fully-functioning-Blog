import React, { Key, useState } from 'react';
import styles from './styles.module.css';
import Link from 'next/link';
import card from '../../post/post.module.css';
import Pagination from '../../pagination';
import { paginate } from '../../../helpers';

const UserPostsUI = ({ user, posts }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 2;

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedPosts = paginate(posts, currentPage, pageSize);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper} aria-live="polite">
        <h5 className={styles.heading}>Your Posts</h5>
        <div className={styles.main} id="main">
          {typeof posts !== 'string'
            ? paginatedPosts.map(
                (
                  post: {
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
                    <article className={card.container} id="post" key={index}>
                      <div className={card.head}>
                        <Link href={`/dashboard/post/${post.slug}`}>
                          <a>
                            <img
                              src={post.banner}
                              className={card.image}
                              alt="Post Image"
                            />
                          </a>
                        </Link>
                      </div>
                      <div className={card.body}>
                        <Link href={`/dashboard/post/${post.slug}`}>
                          <a>
                            <h3 className={card.title} id="post-title">
                              {post.title}
                            </h3>
                          </a>
                        </Link>

                        <p className={card.desc}>{post.description}</p>
                        <p className={card.reading__time} id="reading-time">
                          {post.readingTime}
                        </p>
                      </div>
                      <div className={card.categories}>
                        {post.categories.map((category: any) => {
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
                        <Link href={`/?user=${post.author}`}>
                          <a>
                            <img
                              src={post.avatar}
                              className={card.avatar}
                              alt="Profile Image"
                            />
                          </a>
                        </Link>
                        <time className={card.time}>
                          {new Date(post.createdAt).toDateString().slice(4)}
                        </time>
                      </div>
                    </article>
                  );
                },
              )
            : ''}
        </div>
        <Pagination
          items={posts.length} // posts length
          currentPage={currentPage} // 1
          pageSize={pageSize} // post per page
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default UserPostsUI;
