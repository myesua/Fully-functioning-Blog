import React, { useEffect, useState, useContext, useRef } from 'react';
import styles from './dashboard.module.css';
import Image from 'next/image';
import Avatar from '../../public/images/resetavatar.png';
import Nav from './nav';
import Main from './main_';
import NotificationUI from './notification';
import Settings from './settings/settings';
import Create from './write/new_post';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import AsideUI from './aside';
import NotificationsUI from '../notifications';

const DashboardUI = ({
  user,
  posts,
  tips,
  pending,
  rejected,
  notification,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [picture, setPicture] = useState(user.profilePicture);
  const [bio, setBio] = useState(user.bio);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const hBtn = Array.from(document.querySelectorAll('#home-icon'));
    const nBtn = Array.from(document.querySelectorAll('#notification-icon'));
    const wBtn = Array.from(document.querySelectorAll('#write-icon'));
    const sBtn = Array.from(document.querySelectorAll('#settings-icon'));
    const mainContent = document.querySelector(
      '#main-content',
    ) as HTMLDivElement;
    const notificationPage = document.querySelector(
      '#notification-page',
    ) as HTMLDivElement;
    const write = document.querySelector('#write') as HTMLDivElement;
    const settings = document.querySelector('#settings') as HTMLDivElement;

    hBtn.forEach((btn) =>
      btn.addEventListener('click', () => {
        mainContent.removeAttribute('style');
        notificationPage.removeAttribute('style');
        write.removeAttribute('style');
        settings.removeAttribute('style');
      }),
    );
    nBtn.forEach((btn) =>
      btn.addEventListener('click', () => {
        mainContent.setAttribute('style', 'display: none');
        notificationPage.setAttribute('style', 'display: flex');
        write.removeAttribute('style');
        settings.removeAttribute('style');
      }),
    );
    wBtn.forEach((btn) =>
      btn.addEventListener('click', () => {
        mainContent.setAttribute('style', 'display: none');
        notificationPage.removeAttribute('style');
        write.setAttribute('style', 'display: block');
        settings.removeAttribute('style');
      }),
    );
    sBtn.forEach((btn) => {
      btn.addEventListener('click', () => {
        settings.setAttribute('style', 'display: grid');
        mainContent.setAttribute('style', 'display: none');
        notificationPage.removeAttribute('style');
        write.removeAttribute('style');
      });
    });
  }, [isOpen]);

  return (
    <div className={styles.container} id="container">
      <div className={styles.wrapper}>
        <AsideUI user={user} notification={notification} />
        <div className={styles.main}>
          <div id="main-content">
            <Main
              user={user}
              posts={posts}
              tips={tips}
              pending={pending}
              rejected={rejected}
            />
          </div>
          <div
            className={styles.notification__container}
            id="notification-page">
            <NotificationsUI notification={notification} />
          </div>
          <div className={styles.write__container} id="write">
            <Create />
          </div>
          <div className={styles.settings__container} id="settings">
            <Settings user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUI;
