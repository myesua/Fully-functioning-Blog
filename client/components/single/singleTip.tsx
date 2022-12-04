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

const SingleTip = ({ tip }: any) => {
  const [isOpen, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [starState, setStarState] = useState(false);
  const [cats, setCats] = useState([]);
  const [posts, setPosts] = useState([]);
  const [nextTips, setNextTips] = useState([]);

  const { user } = useContext(Context);
  let authorAvatar = user && user.profilePicture;
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const author = user?.firstname + ' ' + user?.lastname;

  const [title, setTitle] = useState(tip.title);
  const [description, setDescription] = useState(tip.description);
  const [banner, setBanner] = useState(tip.banner);
  const [categories, setCategories] = useState(tip.categories);
  const [readingTime, setReadingTime] = useState(tip.readingTime);
  const [content, setContent] = useState(tip.content);

  const [loaded, setLoaded] = useState(false);

  /**Get post categories from server */
  useEffect(() => {
    const getCategories = async () => {
      const res = await axios.get(`${process.env.API_URI}/categories`);
      setCats(res.data.categories);
    };
    const getNextTip = async () => {
      const res = await axios.get(`${process.env.API_URI}/tips`);
      setNextTips(res.data.tips);
    };
    const getPosts = async () => {
      const res = await axios.get(`${process.env.API_URI}/posts`);
      setPosts(res.data.posts);
    };
    getPosts;
    getNextTip();
    getCategories();
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

  useEffect(() => {
    const overlay = document.getElementById('blur-overlay') as HTMLDivElement;
    const editIcon = document.querySelector('#edit-icon') as HTMLImageElement;
    const updateForm = document.getElementById('update') as HTMLElement;
    const toggleUpdateForm = () => {
      setLoaded(true);
      overlay.style.display = 'block';
      updateForm.style.display = 'block';
      document.body.style.overflow = 'hidden';
    };
    tip.author === author &&
      editIcon.addEventListener('click', toggleUpdateForm);

    let newCategories: string[] = [];
    const categoriesEl =
      document.querySelectorAll<HTMLElement>('#category-option');

    categoriesEl.forEach((option) => {
      let selected = false;
      const CustomSelect = () => {
        if (!selected) {
          selected = true;
          if (
            !newCategories.includes(option.innerText) &&
            !option.hasAttribute('style')
          ) {
            newCategories.push(option.innerText);
            setCategories(newCategories);
            option.setAttribute(
              'style',
              'background: #396afc; color: #fff; transition: background 0.1s',
            );
          }
        } else if (option.hasAttribute('style')) {
          selected = false;
          newCategories.pop();
          setCategories(newCategories);
          option.removeAttribute('style');
        }
      };
      if (tip.categories.includes(option.innerText)) {
        selected = true;
        newCategories.push(option.innerText);
        setCategories(newCategories);
        option.setAttribute(
          'style',
          'background: #396afc; color: #fff; transition: background 0.1s',
        );
      }

      option.addEventListener('click', CustomSelect);

      return {
        newCategories,
      };
    });
  }, [loaded]);

  /**Handle Tip update */
  const handleUpdate = async () => {
    try {
      await axios.put(`${process.env.API_URI}/tips/${tip._id}`, {
        author: author,
        title: title,
        description: description,
        banner: banner,
        categories: categories,
        readingTime: readingTime,
        content: content,
        slug: title.toLowerCase().split(' ').join('-').replace(/\?/g, ''),
        avatar: authorAvatar,
      });
      console.log('🎉', 'Your post has been updated successfully!');
      window.location.replace('/');
    } catch (err) {
      console.log(err);
    }
  };

  /**Handle Tip delete */
  const handleModal = () => {
    setOpen(!isOpen);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.API_URI}/tips/${tip._id}`, {
        data: { author: author },
      });
      router.push('/');
    } catch (err) {
      console.log(err);
    }
  };

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
        <Header />
      </div>
      <div className={styles.formContainer}>
        <div className={styles.form} id="update">
          <h1 className={styles.form__header}>Update tip</h1>
          <div
            className={styles.input}
            contentEditable="true"
            onInput={(e: any) => setTitle(e.target.innerText)}
            suppressContentEditableWarning={true}>
            {tip.title}
          </div>

          <div
            className={styles.input}
            contentEditable="true"
            onInput={(e: any) => setDescription(e.target.innerText)}
            suppressContentEditableWarning={true}>
            {tip.description}
          </div>
          <div
            className={styles.input}
            contentEditable="true"
            onInput={(e: any) => setBanner(e.target.innerText)}
            suppressContentEditableWarning={true}>
            {tip.banner}
          </div>

          <div className={styles.categories__options} id="categories-options">
            {cats.map((cat: any, index: Key) => {
              return (
                <span
                  key={index}
                  className={styles.cat__option}
                  id="category-option">
                  {cat.name.toLowerCase()}
                </span>
              );
            })}
          </div>

          <div>
            <select
              className={styles.options}
              name="reading-time"
              onChange={(e) => setReadingTime(e.target.value)}
              required>
              <option value={tip.readingTime}>{tip.readingTime}</option>
              {readingDuration.map((duration, index) => {
                while (duration.value !== tip.readingTime) {
                  return (
                    <option value={duration.value} key={index}>
                      {duration.value}
                    </option>
                  );
                }
              })}
            </select>
          </div>
          <ReactQuill
            modules={modules}
            theme="snow"
            defaultValue={tip.content}
            onChange={setContent}
            placeholder="Content goes here..."
          />

          <div className={styles.submitButtonContainer}>
            <button onClick={handleUpdate} className={styles.submitButton}>
              Submit
            </button>
          </div>
        </div>
      </div>
      <div className={styles.blur__overlay} id="blur-overlay"></div>
      <article className={styles.container}>
        <header className={styles.header}>
          <div className={styles.top__section}>
            <h1>{tip.title}</h1>
            {tip.author === author && (
              <div className={styles.owner__icons}>
                <Image
                  src={EditIcon}
                  width={30}
                  height={20}
                  id="edit-icon"
                  alt=""
                  priority
                />
                <Image
                  src={DeleteIcon}
                  width={30}
                  height={20}
                  alt=""
                  onClick={handleModal}
                  priority
                />
              </div>
            )}
          </div>
          {isOpen && (
            <div className={styles.modal} ref={ref}>
              <span
                className={styles.hiddenNav__closebtn}
                onClick={handleModal}>
                ⨉
              </span>
              <div className={styles.prompt}>
                Are you sure you wanted to delete this post?
              </div>
              <div className={styles.button__container}>
                <button onClick={handleDelete}>Yes</button>
                <button onClick={handleModal}>No</button>
              </div>
            </div>
          )}
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
