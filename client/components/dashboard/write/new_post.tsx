import React, { Key, useContext, useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import styles from './write.module.css';
import axios from 'axios';
import { Context } from '../../../context/context';
import dynamic from 'next/dynamic';

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

const url = 'http://localhost:8080/api'; // change in production

const Create = () => {
  const { user } = useContext(Context);
  let author = user && user.firstname + ' ' + user.lastname;
  let authorAvatar = user && user.profilePicture;

  const [articleType, setArticleType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [banner, setBanner] = useState('');
  const [categories, setCategories] = useState('');
  const [readingTime, setReadingTime] = useState('');
  const [value, setValue] = useState('');

  const [cats, setCats] = useState([]);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      const res = await axios.get(`${url}/categories`);
      setCats(res.data.categories);
    };
    getCategories();
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const newPost = {
      type: articleType,
      title,
      description,
      banner,
      categories,
      readingTime,
      content: value,
      author: author,
      avatar: authorAvatar,
    };
    try {
      const res = await axios.post(`${process.env.API_URL}/posts`, newPost);
      window.location.replace(`/post/${res.data.slug}`);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const typePost = document.getElementById('type-post') as HTMLSpanElement;
    const typeTip = document.getElementById('type-tip') as HTMLSpanElement;

    typePost?.addEventListener('click', handleSelection);
    typeTip?.addEventListener('click', handleSelection);
  }, []);

  let selected = false;

  const handleSelection = (e: MouseEvent) => {
    const el = e.target as HTMLSpanElement;
    const nextSibling = el.nextElementSibling as HTMLSpanElement;
    const previousSibling = el.previousElementSibling as HTMLSpanElement;

    if (!selected && !el.hasAttribute('style')) {
      selected = true;
      el.setAttribute(
        'style',
        `background-color: var(--bg-color-primary); color: #fff`,
      );
      if (el.innerText === 'Post') {
        nextSibling.style.pointerEvents = 'none';
      } else {
        previousSibling.style.pointerEvents = 'none';
      }
      setArticleType(el.innerText);
    } else if (el.innerText === 'Tip') {
      selected = false;
      el.removeAttribute('style');
      previousSibling.style.pointerEvents = 'all';
    } else {
      selected = false;
      el.removeAttribute('style');
      nextSibling.style.pointerEvents = 'all';
    }
  };

  return (
    <>
      <div className={styles.container}>
        <form className={styles.wrapper} onSubmit={handleSubmit} id="create">
          <h1 className={styles.header}>Create new article</h1>
          <div className={styles.article__type}>
            <label>Choose article type:</label>
            <br />
            <br />
            <span className={styles.article__type__post} id="type-post">
              Post
            </span>
            <span className={styles.article__type__tip} id="type-tip">
              Tip
            </span>
          </div>

          <div>
            <input
              className={styles.input}
              type="text"
              name="title"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              className={styles.input}
              type="text"
              name="description"
              placeholder="Post description"
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              className={styles.input}
              type="text"
              name="banner"
              placeholder="Enter image url for post banner..."
              onChange={(e) => setBanner(e.target.value)}
              required
            />
          </div>
          <div>
            <select
              className={styles.options}
              name="categories"
              onChange={(e) => setCategories(e.target.value.toLowerCase())}
              required>
              {cats.map((cat: any, index: Key) => (
                <option key={index} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              className={styles.options}
              name="reading-time"
              onChange={(e) => setReadingTime(e.target.value)}
              defaultValue="5 mins read"
              required>
              <option value="2 mins read">2 mins read</option>
              <option value="3 mins read">3 mins read</option>
              <option value="5 mins read">5 mins read</option>
              <option value="7 mins read">7 mins read</option>
            </select>
          </div>
          <ReactQuill
            modules={modules}
            theme="snow"
            onChange={setValue}
            placeholder="Content goes here..."
          />

          <div className={styles.submitButtonContainer}>
            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Create;
