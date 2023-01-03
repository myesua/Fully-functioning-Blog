import React, { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/future/image';

import styles from './single.module.css';

import facebook from '../../public/images/facebook.svg';
import linkedin from '../../public/images/linkedin.svg';
import twitter from '../../public/images/twitter.svg';
import advertsample from '../../public/images/advertsample.png';
import arrow from '../../public/down.svg';

import axios from 'axios';
import DOMPurify from 'dompurify';

import Header from '../header/Header';
import Tip from '../tip/tip';
import NextPost from '../post/nextPost';
import Subscription from '../subscription/subscription';
import Footer from '../footer/Footer';

function shuffle(a: any) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

const SinglePost = ({ post }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [tips, setTips] = useState([]);
  const [nextPosts, setNextPosts] = useState([]);

  /**Get data from server */
  useEffect(() => {
    const getTips = async () => {
      const res = await axios.get(`${process.env.TIPS_URL}`);
      setTips(res.data.tips);
    };

    const getNextPost = async () => {
      const res = await axios.get(`${process.env.POSTS_URL}`);
      setNextPosts(res.data.posts);
    };
    getNextPost();
    getTips();
  }, []);

  /**Prevent XSS from Editor*/
  const sanitizeData = () => ({
    __html: DOMPurify.sanitize(post.content),
  });

  const url = location.href;

  const shareOnFB = () => {
    const navUrl =
      'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
    window.open(navUrl, '_blank');
  };

  const shareOnTwitter = () => {
    const navUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url,
    )}&text=${encodeURIComponent(post.title)}`;
    window.open(navUrl, '_blank');
  };

  const shareOnLinkedIn = () => {
    const navUrl = `http://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      url,
    )}&title=${encodeURIComponent(url)}`;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerDiv}>
        <Header user={undefined} />
      </div>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.top__section}>
            <h1>{post.title}</h1>
          </div>
          <p className={styles.post__description}>{post.description}</p>
        </header>

        <section className={styles.main}>
          <div className={styles.author}>
            <div className={styles.author__info}>
              <Link href={`/?user=${post.author}`}>
                <a>
                  <img
                    src={post.avatar}
                    className={styles.avatar}
                    alt="Profile Image"
                  />
                </a>
              </Link>
              <span>{post.author}</span>
            </div>
            <time>
              {post.updatedAt > post.createdAt
                ? 'Last edited on' +
                  ' ' +
                  new Date(post.updatedAt).toDateString().slice(4)
                : new Date(post.createdAt).toDateString().slice(4)}
            </time>
          </div>
          <div className={styles.top}>
            <Image
              src={post.banner}
              width="0"
              height="0"
              sizes="100vw"
              className={styles.top__image}
              alt="Post Image"
            />
          </div>

          <div className={styles.article}>
            <div className={styles.article__body}>
              <div
                className={styles.body}
                dangerouslySetInnerHTML={sanitizeData()}></div>

              <div className={styles.footer}>
                <span className={styles.footer__head}>
                  Please let us know what you think about this article
                </span>
                <br />
                <span className={styles.footer__text}>
                  How would you rate this aricle?
                </span>
                <div className={styles.stars} id="stars">
                  {[...Array(5)].map((star, index) => {
                    index += 1;
                    return (
                      <button
                        type="button"
                        key={index}
                        className={
                          index <= (rating || hover) ? styles.on : styles.off
                        }
                        onClick={() => setRating(index)}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(rating)}
                        onDoubleClick={() => {
                          setRating(0);
                          setHover(0);
                        }}>
                        <span className={styles.star}>&#9733;</span>
                      </button>
                    );
                  })}
                </div>
                <Link href="/">
                  <button className={styles.continue} type="button">
                    Continue
                  </button>
                </Link>
              </div>
            </div>
            <aside className={styles.aside}>
              <div className={styles.tags}>
                <ul className={styles.tags__links}>
                  {post.categories.map((cat: any) => {
                    return (
                      <Link href={`/?cat=${cat}`} key={cat._id}>
                        <a>
                          <li>{cat}</li>
                        </a>
                      </Link>
                    );
                  })}
                </ul>
              </div>
              <div className={styles.share}>
                <h5>Share article</h5>
                <ul className={styles.share__links}>
                  <li>
                    <img
                      alt="facebook"
                      src={facebook.src}
                      onClick={shareOnFB}
                    />
                  </li>
                  <li>
                    <img
                      alt="twitter"
                      src={twitter.src}
                      onClick={shareOnTwitter}
                    />
                  </li>
                  <li>
                    <img
                      alt="linkedin"
                      src={linkedin.src}
                      onClick={shareOnLinkedIn}
                    />
                  </li>
                </ul>
              </div>
              <div className={styles.advertsample}>
                <a href="#">
                  <img src={advertsample.src} alt="Image" />
                </a>
              </div>
              <div className={styles.related}>
                <h5>Related</h5>
                <div className={styles.related__child}>
                  {tips.slice(0, 3).map((tip: any) => {
                    const match = tip.categories.some((i: any) =>
                      post.categories.includes(i),
                    );
                    if (match == true) return <Tip tip={tip} key={tip._id} />;
                  })}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className={styles.readnext}>
          <div className={styles.readnext__head}>
            <Image src={arrow} width={15} height={25} alt="arrow" />
            <span className={styles.readnext__headtext}>Read next</span>
          </div>
          <div className={styles.read__next}>
            {shuffle(Array.from(nextPosts))
              .slice(0, 1)
              .map((next: { title: string; _id: string }) => {
                const checkTitle = next.title !== post.title;
                return checkTitle && <NextPost post={next} key={next._id} />;
              })}
          </div>
        </section>
      </div>
      <div className={styles.article__page__bottom}>
        <Subscription />
        <Footer />
      </div>
    </div>
  );
};

export default SinglePost;
