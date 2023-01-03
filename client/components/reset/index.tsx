import React, { useEffect, useState } from 'react';
import styles from './reset.module.css';
import Header from '../header/Header';
import Image from 'next/image';
import ResetAvatar from '../../public/images/avatar.png';
import visible from '../../public/visible.svg';
import invisible from '../../public/invisible.svg';
import axios from 'axios';
import { useRouter } from 'next/router';

const ResetPassword = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [inputError, setInputError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const password = document.querySelector('#password') as HTMLInputElement;
    const confirmPassword = document.querySelector(
      '#confirm-password',
    ) as HTMLInputElement;
    const actionBtn = document.querySelector(
      '#action-btn',
    ) as HTMLButtonElement;

    const checkPasswordMatch = () => {
      if (password.value !== confirmPassword.value) {
        actionBtn.disabled = true;
        setInputError('Password mismatch!');
      } else {
        actionBtn.disabled = false;
        setInputError('');
      }
    };

    function debounce(callback, wait) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          callback.apply(this, args);
        }, wait);
      };
    }

    confirmPassword.addEventListener(
      'keyup',
      debounce(() => {
        checkPasswordMatch();
      }, 1000),
    );
  }, []);
  useEffect(() => {
    const eyeIcon = document.getElementById('eye-icon') as HTMLImageElement;
    const eyeIcon2 = document.getElementById('eye-icon-2') as HTMLImageElement;
    const passwordBox = document.querySelector('#password') as HTMLInputElement;
    const confirmPasswordBox = document.querySelector(
      '#confirm-password',
    ) as HTMLInputElement;

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

    const handleEyeIcon2 = () => {
      if (!initialState) {
        initialState = true;
        confirmPasswordBox.type = 'text';
        eyeIcon2.src = invisible.src;
        eyeIcon2.srcset = invisible.src;
      } else {
        initialState = false;
        confirmPasswordBox.type = 'password';
        eyeIcon2.src = visible.src;
        eyeIcon2.srcset = visible.src;
      }
    };

    eyeIcon.addEventListener('click', handleEyeIcon);
    eyeIcon2.addEventListener('click', handleEyeIcon2);

    return () => {
      eyeIcon.removeEventListener('click', handleEyeIcon);
      eyeIcon2.removeEventListener('click', handleEyeIcon2);
    };
  }, []);

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

    if (error) {
      messageContainer.setAttribute(
        'style',
        'background-color: var(--bg-color-secondary); color: var(--text-color-white); transform: translateY(0)',
      );
      setTimeout(function () {
        messageContainer.style.transform = 'translateY(-100px)';
      }, 3000);
    }
  }, [message, error]);

  const handleReset = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.RESET_URL}`, {
        token: token,
        password: password,
        confirmPassword: password,
      });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response.data.message);
    }
  };
  return (
    <div className={styles.parent}>
      <div className={styles.header}>
        <Header />
        <div className={styles.message} id="message">
          {message || error}
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <form onSubmit={handleReset} className={styles.form}>
            <div className={styles.heading}>Reset Password</div>
            <div className={styles.form__child}>
              <div className={styles.image__container}>
                <Image
                  className={styles.image}
                  src={ResetAvatar}
                  width={100}
                  height={100}
                  alt=""
                />
              </div>
              <input
                className={styles.input__box}
                onChange={(e) => setToken(e.target.value)}
                type="text"
                name="resetToken"
                placeholder="Reset Token"
              />
              <div className={styles.input__container}>
                <input
                  className={styles.input__box}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  placeholder="New Password"
                  id="password"
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
              <div className={styles.input__container}>
                <input
                  className={styles.input__box}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  id="confirm-password"
                />
                <span className={styles.visibility}>
                  <Image
                    src={visible}
                    id="eye-icon-2"
                    height={25}
                    alt="see password as you type"
                    priority
                  />
                </span>
              </div>
              <div className={styles.button__container}>
                <button type="submit" className={styles.button} id="action-btn">
                  Continue
                </button>
              </div>
              <span className={styles.input__error}>{inputError}</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
