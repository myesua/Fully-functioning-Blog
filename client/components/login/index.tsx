import React, { useContext, useEffect, useRef, useState } from 'react';
import Header from '../../components/header/Header';
import styles from './login.module.css';
import Image from 'next/image';
import visible from '../../public/visible.svg';
import invisible from '../../public/invisible.svg';
import ErrorInfoIcon from '../../public/errorinfo.svg';
import ResetAvatar from '../../public/images/avatar.png';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Context } from '../../context/context';

const LoginUI = ({ user }) => {
  const { auth, dispatch } = useContext(Context);

  const [loggedIn, setLoggedIn] = useState('false');
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Sign in
    /***
     * Password visibility check on client side only
     */
    const eyeIcon = document.getElementById('eye-icon') as HTMLImageElement;
    const passwordBox = document.querySelector('#password') as HTMLInputElement;

    let initialState = false;
    const handleEyeIcon = () => {
      if (!initialState) {
        initialState = true;
        passwordBox.type = 'text';
        eyeIcon.src = invisible.src;
        eyeIcon.srcset = invisible.src;
      } else {
        initialState = false;
        passwordBox.type = 'password';
        eyeIcon.src = visible.src;
        eyeIcon.srcset = visible.src;
      }
    };

    eyeIcon.addEventListener('click', handleEyeIcon);

    return () => {
      eyeIcon.removeEventListener('click', handleEyeIcon);
    };
  }, []);

  const handleSignin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await axios.post(
        `${process.env.LOGIN_URL}`,
        { email, password },
        { withCredentials: true },
      );
      // axios.defaults.withCredentials = true;
      setMessage(res.data.message);
      dispatch({ type: 'LOGIN_SUCCESS', payload: 'true' });
    } catch (err) {
      setMessage(err.response.data.message);
      dispatch({ type: 'LOGIN_FAILURE', payload: 'false' });
    }
  };

  useEffect(() => {
    const messageContainer = document.querySelector(
      '#message',
    ) as HTMLDivElement;

    if (message) {
      messageContainer.setAttribute(
        'style',
        'background-color: var(--bg-color-secondary); color: var(--text-color-white); transform: translateY(0)',
      );
      setTimeout(function () {
        messageContainer.style.transform = 'translateY(-100px)';
        router.push('/');
      }, 4000);
    }
  }, [message]);

  if (user) router.push('/dashboard');
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header user={user} />
        <div className={styles.message} id="message">
          {message}
        </div>
      </div>
      <div className={styles.parent}>
        <div className={styles.wrapper}>
          <div className={styles.accountOptions}>
            <div className={styles.signInOption} id="sign-in">
              <span>Sign In</span>
            </div>
          </div>
          <form
            className={styles.signin}
            id="sign-in-form"
            onSubmit={handleSignin}>
            <div className={styles.image__container}>
              <Image
                className={styles.image}
                src={ResetAvatar}
                width={100}
                height={100}
                alt=""
              />
            </div>
            <div className={styles.formWrapper}>
              <div>
                <input
                  className={styles.textBox}
                  data-target="email-input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  ref={emailRef}
                />
              </div>
              <div>
                <div className={styles.passContainer}>
                  <input
                    className={styles.passBox}
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    ref={passwordRef}
                  />
                  <span className={styles.visibility}>
                    <Image
                      src={visible}
                      id="eye-icon"
                      height={25}
                      alt="see password as you type"
                      priority
                    />
                  </span>
                </div>
              </div>
              <button
                className={styles.action}
                id="signin-submit"
                type="submit">
                Sign in
              </button>
            </div>
            <Link href="/recover">
              <a>
                <p className={styles.recoverKey}>Forgot your password?</p>
              </a>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginUI;
