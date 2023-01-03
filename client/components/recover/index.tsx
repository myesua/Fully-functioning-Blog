import React, { useEffect, useState } from 'react';
import styles from '../reset/reset.module.css';
import Image from 'next/image';
import ResetAvatar from '../../public/images/avatar.png';
import axios from 'axios';
import Header from '../header/Header';
import { useRouter } from 'next/router';

const Recover = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  const handleReset = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.RECOVERY_URL}`, {
        email: email,
      });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  useEffect(() => {
    const messageContainer = document.querySelector(
      '#message',
    ) as HTMLDivElement;

    if (message) {
      messageContainer.style.transform = 'translateY(0)';
      setTimeout(function () {
        messageContainer.style.transform = 'translateY(-100px)';
        router.push('/reset');
      }, 4000);
    }

    if (error) {
      messageContainer.setAttribute(
        'style',
        'background-color: #f85032; color: #4c0d0de6; transform: translateY(0)',
      );
      setTimeout(function () {
        messageContainer.style.transform = 'translateY(-100px)';
      }, 3000);
    }
  }, [message, error]);

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
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
                placeholder="Email"
              />
              <div className={styles.button__container}>
                <button className={styles.button}>Start</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Recover;
