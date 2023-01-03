import Link from 'next/link';
import React, { useState, useEffect, useRef, useContext } from 'react';
import styles from './Header.module.css';
import MenuIcon from '../../public/images/menuicon.svg';
import Image from 'next/image';

import { useRouter } from 'next/router';
import axios from 'axios';
import { Context } from '../../context/context';

const Header = ({ user }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [blur, setBlur] = useState(false);

  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const { auth, dispatch } = useContext(Context);
  const router = useRouter();
  const id = user?._id.toString();

  useEffect(() => {
    setHydrated(true);
  }, [hydrated]);

  useEffect(() => {
    const searchInput = document.getElementById(
      'search-input',
    ) as HTMLInputElement;
    const searchOutputBox = document.getElementById(
      'search-output-box',
    ) as HTMLDivElement;
    const overlay = document.getElementById('blur-overlay') as HTMLDivElement;

    const removeOverlay = () => {
      setBlur(false);
      overlay.removeAttribute('style');
      searchOutputBox.setAttribute('style', 'display: none');
    };
    const applyOverlay = (e) => {
      if (e.target.value == '') {
        setBlur(false);
        overlay.removeAttribute('style');
      }
      setBlur(true);
      overlay.setAttribute('style', 'display: block');
    };
    overlay.addEventListener('click', removeOverlay);
    searchInput.addEventListener('input', () => {
      const wrapper = document.getElementById('wrapper') as HTMLDivElement;
      const h1s = wrapper.getElementsByTagName('h1');
      const post = document.querySelectorAll('#post');
      const postTitle = document.querySelectorAll('#post-title');
      const tag = document.querySelectorAll('#tag');
      const readingTime = document.querySelectorAll('#reading-time');
      const author = document.querySelectorAll('#author');
      const tip = document.querySelectorAll('#tip');
      const footerSocial = document.querySelector('#footer-social');
      const footerh5 = document.querySelector('#footer-h5');
      const footerPrivacy = document.querySelector('#footer-privacy');
      const footerLink = document.querySelectorAll('#footer-link');
      wrapper.setAttribute('style', 'background-color: #000');
      Array.from(h1s).forEach((h1) => h1.setAttribute('style', 'color: #fff'));
      Array.from(post).forEach((i) => i.setAttribute('style', 'color: #fff'));
      Array.from(postTitle).forEach((i) =>
        i.setAttribute('style', 'color: #fff'),
      );
      Array.from(tag).forEach((i) =>
        i.setAttribute('style', 'background-color: #283c86'),
      );
      Array.from(readingTime).forEach((i) =>
        i.setAttribute('style', 'color: #fff'),
      );
      Array.from(author).forEach((i) => i.setAttribute('style', 'color: #fff'));
      Array.from(tip).forEach((i) =>
        i.setAttribute('style', 'background-color: #fff'),
      );
      footerSocial.setAttribute('style', 'color: #fff');
      footerPrivacy.setAttribute('style', 'color: #fff');
      footerh5.setAttribute('style', 'color: #fff');
      Array.from(footerLink).forEach((i) =>
        i.setAttribute('style', 'color: #fff'),
      );
    });
  }, [blur]);

  useEffect(() => {
    const getSearchResults = async () => {
      if (!query || query.length === 0 || query.length > 3) {
        setSearchResult([]);
        return false;
      }

      if (query.length > 2) {
        const res = await axios.get(`${process.env.API_URI}/posts`, {
          params: {
            search: query,
          },
        });

        setSearchResult(res.data);
      }
    };

    getSearchResults();
  }, [query]);

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setQuery(e.target.value);

  const handleHiddenNav = () => {
    setOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${process.env.LOGOUT_URL}`,
        { id: id },
        {
          withCredentials: true,
        },
      );
      dispatch({ type: 'LOGOUT' });
      router.push('/login');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Image
            src={MenuIcon}
            width={25}
            height={25}
            layout="fixed"
            alt=""
            onClick={handleHiddenNav}
            priority
          />
          <Link href="/">
            <span>
              <a>Bechellente</a>
            </span>
          </Link>
        </div>

        <ul className={styles.toplinks}>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/products">
              <a>Products</a>
            </Link>
          </li>
          <li>
            <Link href="/services">
              <a>Services</a>
            </Link>
          </li>
          {hydrated && !user && (
            <li>
              <Link href="/login">
                <a>Login</a>
              </Link>
            </li>
          )}

          {hydrated && user && (
            <li>
              <Link href="/dashboard">
                <a>Dashboard</a>
              </Link>
            </li>
          )}
        </ul>

        <span className={styles.topsearch}>
          <input
            type="search"
            placeholder="Search blog posts"
            id="search-input"
            onChange={handleChange}
          />
        </span>
        <div className={styles.search__output__wrapper} id="search-output-box">
          {searchResult.map((post) => (
            <Link href={`/post/${post.slug}`}>
              <a>
                <div className={styles.search__output__box}>
                  <div className={styles.search__output__box__text}>
                    <div className={styles.search__output__box__text__title}>
                      {post.title}
                    </div>
                    <div className={styles.search__output__box__text__desc}>
                      {post.description}
                    </div>
                    <div className={styles.search__output__box__others}>
                      <span>
                        {new Date(post.createdAt).toDateString().slice(4)}
                      </span>
                      <span>{post.visits} views</span>
                      <span>{post.readingTime}</span>
                    </div>
                  </div>
                  <div className={styles.search__output__box__icon}>↲</div>
                </div>
              </a>
            </Link>
          ))}
        </div>
        <div className={styles.blur__overlay} id="blur-overlay"></div>
        {isOpen && (
          <div className={styles.hiddenNav} ref={ref}>
            {/* <span
              className={styles.hiddenNav__closebtn}
              onClick={handleHiddenNav}>
              ⨉
            </span> */}
            <ul>
              <li>
                <Link href="/">
                  <a onClick={handleHiddenNav}>Home</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a onClick={handleHiddenNav}>About us</a>
                </Link>
              </li>

              <li>
                {user ? (
                  <Link href="/dashboard">
                    <a onClick={handleHiddenNav}>Dashboard</a>
                  </Link>
                ) : (
                  <Link href="/login">
                    <a onClick={handleHiddenNav}>Login</a>
                  </Link>
                )}
              </li>
              <li>
                <Link href="#latest">
                  <a onClick={handleHiddenNav}>Latest</a>
                </Link>
              </li>
              <li>
                <Link href="#popular">
                  <a onClick={handleHiddenNav}>Popular</a>
                </Link>
              </li>
              <li>
                <Link href="#tips">
                  <a onClick={handleHiddenNav}>Tips</a>
                </Link>
              </li>
              {user && (
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Header;
