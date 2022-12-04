import React, { useContext, useEffect, useRef, useState } from 'react';
import Header from '../components/header/Header';
import styles from '../styles/login.module.css';
import Image from 'next/image';
import visible from '../public/visible.svg';
import invisible from '../public/invisible.svg';
import ErrorInfoIcon from '../public/errorinfo.svg';
import Link from 'next/link';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { fetchUser } from '../features/fetchData';
import { setAuthToken } from '../app/auth';

const Login = () => {
  const [initialState, setInitialState] = useState(false);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Sign in
    /***
     * Password visibility check on client side only
     */
    const eyeIcon = document.getElementById('eye-icon') as HTMLImageElement;
    const passwordBox = document.querySelector('#password') as HTMLInputElement;

    const handleEyeIcon = () => {
      if (!initialState) {
        setInitialState(true);
        passwordBox.type = 'text';
        eyeIcon.src = invisible.src;
        eyeIcon.srcset = invisible.src;
      } else {
        setInitialState(false);
        passwordBox.type = 'password';
        eyeIcon.src = visible.src;
        eyeIcon.srcset = visible.src;
      }
    };

    eyeIcon.addEventListener('click', handleEyeIcon);

    return () => {
      eyeIcon.removeEventListener('click', handleEyeIcon);
    };
  }, [initialState]);

  const handleSignin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.API_URI}/auth/login`,
        {
          email: emailRef.current!.value,
          password: passwordRef.current!.value,
        },
        { withCredentials: true },
      );
      setAuthToken(res.data.hash);
      console.log(res.data);
      router.push('/');
    } catch (err: any) {
      console.log(err);
      // setError(err.response.data);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerDiv}>
        <Header />
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
            <label className={styles.label}>Sign in to your account</label>
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
                <div className={styles.alertErrorBox__1} id="alert-box-1">
                  <span>
                    <Image
                      src={ErrorInfoIcon}
                      width={20}
                      height={20}
                      layout="fixed"
                      alt=""
                    />
                  </span>
                  <span id="input-error"></span>
                </div>
                {error && (
                  <div className={styles.alertErrorBox__2}>
                    <span>
                      <Image
                        src={ErrorInfoIcon}
                        width={20}
                        height={20}
                        layout="fixed"
                        alt=""
                      />
                    </span>
                    <span>{error}</span>
                  </div>
                )}
              </div>
              <button
                className={styles.action}
                id="signin-submit"
                type="submit">
                Sign in
              </button>
            </div>
            <Link href="/account">
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

export default Login;
