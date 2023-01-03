import React, { Key, useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/future/image';
import { useRouter } from 'next/router';

import styles from './single.module.css';
import 'react-quill/dist/quill.snow.css';

import facebook from '../../public/images/facebook.svg';
import linkedin from '../../public/images/linkedin.svg';
import twitter from '../../public/images/twitter.svg';
import advertsample from '../../public/images/advertsample.png';
import arrow from '../../public/down.svg';
import EditIcon from '../../public/edit.svg';
import DeleteIcon from '../../public/delete.svg';

import axios from 'axios';
import DOMPurify from 'dompurify';
import dynamic from 'next/dynamic';

import { Context } from '../../context/context';
import Header from '../header/Header';
import NextTip from '../tip/nextTip';
import Post from '../post/post';
import Subscription from '../subscription/subscription';
import Footer from '../footer/Footer';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
});

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }, { align: [] }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
};

const readingDuration = [
  {
    value: '2 mins read',
  },
  {
    value: '3 mins read',
  },
  {
    value: '5 mins read',
  },
  {
    value: '7 mins read',
  },
];

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

const SingleTip = ({ tip }) => {
  const [isOpen, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [starState, setStarState] = useState(false);
  const [posts, setPosts] = useState([]);
  const [nextTips, setNextTips] = useState([]);

  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  /**Get post categories from server */
  useEffect(() => {
    const getNextTip = async () => {
      const res = await axios.get(`${process.env.TIPS_URL}`);
      setNextTips(res.data.tips);
    };
    const getPosts = async () => {
      const res = await axios.get(`${process.env.POSTS_URL}`);
      setPosts(res.data.posts);
    };
    getPosts;
    getNextTip();
  }, []);

  useEffect(() => {
    const checkOutsideClick = (e: any) => {
      if (isOpen && ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', checkOutsideClick);

    return () => {
      document.removeEventListener('mousedown', checkOutsideClick);
    };
  }, [isOpen]);

  /**Hook to toggle `updateForm` when author clicks edit button */

  // Handle rating stars
  const handleStar = (e: any) => {
    if (!starState) {
      setStarState(true);
      e.target.style.fill = '#FFE76D';
      return;
    } else {
      setStarState(false);
      e.target.style.fill = '#FFFFFF';
      return;
    }
  };

  // To prevent XSS vulnerabilities
  const sanitizeData = () => ({
    __html: DOMPurify.sanitize(tip.content),
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
    )}&text=${encodeURIComponent(tip.title)}`;
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
      <article className={styles.container}>
        <header className={styles.header}>
          <div className={styles.top__section}>
            <h1>{tip.title}</h1>
          </div>

          <p className={styles.post__description}>{tip.description}</p>
        </header>

        <section className={styles.main}>
          <div className={styles.author}>
            <div className={styles.author__info}>
              <Link href={`/?user=${tip.author}`}>
                <a>
                  <img
                    src={tip.avatar}
                    className={styles.avatar}
                    alt="Profile Image"
                  />
                </a>
              </Link>
              <span>{tip.author}</span>
            </div>
            <time>
              {tip.updatedAt > tip.createdAt
                ? 'Last edited on' +
                  ' ' +
                  new Date(tip.updatedAt).toDateString().slice(4)
                : new Date(tip.createdAt).toDateString().slice(4)}
            </time>
          </div>
          <div className={styles.top}>
            <Image
              src={tip.banner}
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
                  {tip.categories.map((cat: any, index: Key) => {
                    return (
                      <Link href={`/?cat=${cat}`} key={index}>
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
                    <img alt="twitter" src={facebook.src} onClick={shareOnFB} />
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
                      alt="twitter"
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
                  {posts.slice(0, 3).map((post: any) => {
                    const match = tip.categories.some((i: any) =>
                      tip.categories.includes(i),
                    );
                    if (match == true)
                      return <Post post={post} key={post._id} />;
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
            {shuffle(Array.from(nextTips))
              .slice(0, 1)
              .map((next: { title: string; _id: string }) => {
                const checkTitle = next.title !== tip.title;
                return checkTitle && <NextTip tip={next} key={next._id} />;
              })}
          </div>
        </section>
      </article>
      <div className={styles.article__page__bottom}>
        <Subscription />
        <Footer />
      </div>
    </div>
  );
};

export default SingleTip;
