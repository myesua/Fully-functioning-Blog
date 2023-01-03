import React, { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/future/image';

import styles from './single.module.css';
import 'react-quill/dist/quill.snow.css';

import facebook from '../../../public/images/facebook.svg';
import linkedin from '../../../public/images/linkedin.svg';
import twitter from '../../../public/images/twitter.svg';
import advertsample from '../../../public/images/advertsample.png';
import arrow from '../../../public/down.svg';
import EditIcon from '../../../public/edit.svg';
import DeleteIcon from '../../../public/delete.svg';

import axios from 'axios';
import DOMPurify from 'dompurify';
import dynamic from 'next/dynamic';

import Header from '../../header/Header';
import Tip from '../../tip/tip';
import NextPost from '../../post/nextPost';
import Subscription from '../../subscription/subscription';
import Footer from '../../footer/Footer';

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

const SingleTip = ({ tip, user }) => {
  const [isOpen, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [cats, setCats] = useState([]);
  const [tips, setTips] = useState([]);
  const [nextPosts, setNextPosts] = useState([]);

  let authorAvatar = user.profilePicture;
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState(tip.title);
  const [desc, setDesc] = useState(tip.description);
  const [banner, setBanner] = useState(tip.banner);
  const [categs, setCategs] = useState(tip.categories);
  const [rt, setRT] = useState(tip?.readingTime);
  const [content, setContent] = useState(tip.content);
  const author = user && user.firstname + ' ' + user.lastname;

  const [loaded, setLoaded] = useState(false);

  /**Get data from server */
  useEffect(() => {
    const getCategories = async () => {
      const res = await axios.get(`${process.env.CATEGORIES_URL}`);
      setCats(res.data.categories);
    };
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
    getCategories();
  }, []);

  /**Handle delete modal */
  useEffect(() => {
    const checkOutsideClick = (e: { target: any }) => {
      if (isOpen && ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', checkOutsideClick);

    return () => {
      document.removeEventListener('mousedown', checkOutsideClick);
    };
  }, [isOpen]);

  const handleModal = () => {
    setOpen(!isOpen);
  };

  const toggleEditForm = () => {
    setIsEdit(!isEdit);
  };

  if (isEdit == true) {
    document.body.style.overflowY = 'hidden';
  } else {
    document.body.style.overflowY = 'scroll';
  }

  /**Function to toggle `updateForm` when author clicks edit button */

  useEffect(() => {
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
            setCategs(newCategories);
            option.setAttribute(
              'style',
              'background-color: var(--bg-color-secondary); color: #fff; transition: background 0.1s ease-in-out',
            );
          }
        } else if (option.hasAttribute('style')) {
          selected = false;
          newCategories.pop();
          setCategs(newCategories);
          option.removeAttribute('style');
        }
      };
      if (tip.categories.includes(option.innerText)) {
        selected = true;
        newCategories.push(option.innerText);
        setCategs(newCategories);
        option.setAttribute(
          'style',
          'background-color: var(--bg-color-secondary); color: #fff; transition: background 0.1s ease-in-out',
        );
      }

      option.addEventListener('click', CustomSelect);

      return {
        newCategories,
      };
    });
  }, [loaded, isEdit]);

  /**Handle post update */
  const handleUpdate = async () => {
    try {
      await axios.put(
        `${process.env.TIPS_URL}/${tip._id}`,
        {
          author: author,
          title: title,
          description: desc,
          banner: banner,
          categories: categs,
          readingTime: rt,
          content: content,
          slug: title.toLowerCase().split(' ').join('-').replace(/\?/g, ''),
          avatar: authorAvatar,
        },
        { withCredentials: true },
      );
      console.log('🎉', 'Your article has been updated successfully!');
      router.push('/dashboard/tips');
    } catch (err) {
      console.log(err);
    }
  };

  /**Handle post delete */
  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.TIPS_URL}/${tip._id}`, {
        data: { author: author },
        withCredentials: true,
      });
      router.push('/dashboard/tips');
    } catch (err) {
      console.log(err);
    }
  };

  /**Prevent XSS from Editor*/
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
        <Header user={user} />
      </div>
      <div className={styles.parent}>
        {isEdit && (
          <div className={styles.formContainer} id="form-container">
            <div className={styles.form} id="update">
              <h1 className={styles.form__header}>Update Tip</h1>
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
                onInput={(e: any) => setDesc(e.target.innerText)}
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

              <div
                className={styles.categories__options}
                id="categories-options">
                {cats.map((cat: any, index: number) => {
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
                  onChange={(e) => setRT(e.target.value)}
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
                <button
                  onClick={toggleEditForm}
                  className={styles.submitButton}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.top__section}>
              <h1>{tip.title}</h1>
              {tip.author === author && (
                <div className={styles.owner__icons}>
                  <Image
                    src={EditIcon}
                    width={30}
                    height={20}
                    alt=""
                    id="edit-icon"
                    onClick={toggleEditForm}
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
                  Are you sure you wanted to delete this tip?
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
                    {tip.categories.map((cat: string, index: number) => {
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
                    {tips.slice(0, 3).map((tip: any, index: number) => {
                      const match = tip.categories.some((i: any) =>
                        tip.categories.includes(i),
                      );
                      if (match == true) return <Tip tip={tip} key={index} />;
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
                .map((next: { title: string; _id: string }, index: number) => {
                  const checkTitle = next.title !== tip.title;
                  return checkTitle && <NextPost post={next} key={index} />;
                })}
            </div>
          </section>
        </div>
      </div>
      <div className={styles.article__page__bottom}>
        <Subscription />
        <Footer />
      </div>
    </div>
  );
};

export default SingleTip;
