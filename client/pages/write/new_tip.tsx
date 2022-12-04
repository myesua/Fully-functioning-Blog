import React, { Key, useContext, useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import styles from './write.module.css';
import Account from '../login';
import Header from '../../components/header/Header';
import axios from 'axios';
import { Context } from '../../context/context';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
});

const Tip = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [banner, setBanner] = useState('');
  const [categories, setCategories] = useState('');
  const [readingTime, setReadingTime] = useState('');
  const [author, setAuthor] = useState('');

  const { user } = useContext(Context);
  const [cats, setCats] = useState([]);

  const [showChild, setShowChild] = useState(false);

  const [value, setValue] = useState('');

  const router = useRouter();

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

  useEffect(() => {
    const getCategories = async () => {
      const res = await axios.get(`${process.env.API_URI}/categories`);
      setCats(res.data);
    };
    getCategories();
  }, []);

  useEffect(() => {
    setShowChild(true);
  }, []);

  useEffect(() => {
    let authorName = user.firstname + ' ' + user.lastname;
    setAuthor(authorName);
  }, [author]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const newPost = {
      title,
      description,
      banner,
      categories,
      readingTime,
      content: value,
      author: author,
    };
    try {
      const res = await axios.post(`${process.env.API_URI}/tips`, newPost);
      router.push(`/tip/${res.data.slug}`);
    } catch (err) {
      console.log(err);
    }
  };

  if (!showChild) {
    return null;
  }

  if (typeof window === 'undefined') {
    return <></>;
  } else {
    return (
      <>
        {user ? (
          <div className={styles.container}>
            <div className={styles.headerDiv}>
              <Header />
            </div>
            <form className={styles.wrapper} onSubmit={handleSubmit}>
              <h1 className={styles.header}>Create new tip</h1>
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
        ) : (
          <Account />
        )}
      </>
    );
  }
};

export default Tip;
