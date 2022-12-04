import Link from 'next/link';
import React, { useState, useEffect, useRef, useContext } from 'react';
import styles from './Header.module.css';
import MenuIcon from '../../public/menu-icon.svg';
import Image from 'next/image';
import { Context } from '../../context/context';
import { useRouter } from 'next/router';
import axios from 'axios';

const Header = ({ user }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [blur, setBlur] = useState(false);
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);

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

  useEffect(() => {
    setHydrated(true);
  }, []);

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
    searchInput.addEventListener('input', applyOverlay);
  }, [blur]);

  useEffect(() => {
    const getSearchResults = async () => {
      if (!query || query.length === 0) {
        setSearchResult([]);
        return false;
      }
      const res = await axios.get(`${process.env.API_URI}/posts`, {
        params: {
          search: query,
        },
      });
      setSearchResult(res.data);
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
    const res = await axios.post(`${process.env.API_URI}/auth/login`);
    console.log(res);
    // router.push('/account');
  };

  return (
    <div className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Image
            src={MenuIcon}
            width={40}
            height={40}
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
            <span
              className={styles.hiddenNav__closebtn}
              onClick={handleHiddenNav}>
              ⨉
            </span>
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
