import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

import Line from './line';
import styles from './notification.module.css';

const NotificationUI = ({ a, index, icon }) => {
  const [resText, setResText] = useState('');
  const fRef = useRef<HTMLDivElement>(null);
  const cRef = useRef<HTMLDivElement>(null);
  const dRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const tRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLDivElement>(null);

  const fRefEl = fRef.current;
  const cRefEl = cRef.current;
  const dRefEl = dRef.current;
  const bRefBtn = bRef.current;
  const tRefEl = tRef.current;
  const closeRefEl = closeRef.current;

  useEffect(() => {
    let initialState = false;
    if (bRef && bRefBtn) {
      bRefBtn.addEventListener('click', () => {
        if (!initialState) {
          initialState = true;
          tRefEl.setAttribute(
            'style',
            'overflow: unset; text-overflow: unset; white-space: unset',
          );
        } else {
          initialState = false;
          tRefEl.removeAttribute('style');
        }
      });
    }
  }, [bRef, bRefBtn, tRef, tRefEl]);

  useEffect(() => {
    if (closeRef && closeRefEl) {
      closeRefEl.addEventListener('click', () => {
        handleDelete();
        cRefEl.style.opacity = '0';
        cRefEl.style.right = '-100px';
        dRefEl.style.opacity = '1';
        dRefEl.style.right = '0';
        setTimeout(() => {
          dRefEl.setAttribute('style', 'transition: all 0.5s ease-in-out');
          fRefEl.addEventListener('transitionend', () => {
            fRefEl.style.display = 'none';
            window.location.reload();
          });
        }, 2000);
      });
    }
  }, [fRef, fRefEl, closeRef, closeRefEl, cRef, cRefEl, dRef, dRefEl]);

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `${process.env.USER_DASHBOARD_URL}/notifications`,
        { data: index, withCredentials: true },
      );
      setResText(`Alert #${index} has been deleted successfully`);
    } catch (err) {
      console.log(err);
      // setResText(err.response.data.message);
    }
  };

  let word = a.text;

  word = word
    .split("'")
    .map((value, index) =>
      index % 2 === 0 ? value : `<strong><em>${value}</em></strong>`,
    )
    .join('');

  if (tRef && tRefEl) {
    tRefEl.innerHTML = word;
  }

  return (
    <div className={styles.flip__wrapper} ref={fRef}>
      <div className={styles.container} ref={cRef}>
        <div className={styles.wrapper}>
          <Line style={{ backgroundColor: icon.props.style.color }} />
          <div className={styles.content}>
            <div className={styles.content__child}>
              {icon}
              <div>
                <div className={styles.top} id="content-body" ref={bRef}>
                  <span>
                    <strong>{a.title}</strong>
                  </span>
                  <span id="text" ref={tRef}>
                    {word}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.close__container}>
              <i className="fa-solid fa-xmark" ref={closeRef}></i>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.flip} ref={dRef}>
        {resText}
      </div>
    </div>
  );
};

export default NotificationUI;
