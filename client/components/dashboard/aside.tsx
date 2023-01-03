import React, { useState } from 'react';
import styles from './dashboard.module.css';
import Image from 'next/image';
import Nav from './nav';

const AsideUI = ({ user, notification }) => {
  const [isOpen, setIsOpen] = useState(false);
  const author = user?.firstname + ' ' + user?.lastname;
  const [picture, setPicture] = useState(user?.profilePicture);
  const [bio, setBio] = useState(user?.bio);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.aside__container}>
      <div className={styles.aside} id="aside">
        <div className={styles.logo}>Bechellente</div>
        <div className={styles.profile__container}>
          <div className={styles.profile}>
            <span className={styles.profile__image__md__lg}>
              <Image src={picture} width={100} height={100} alt="avatar" />
            </span>
            <span className={styles.profile__image__sm}>
              <Image src={picture} width={20} height={20} alt="avatar" />
            </span>
            <span className={styles.author__name}>{author}</span>
            <span className={styles.author}>{user?.role}</span>
            <span className={styles.author__bio}>{bio}</span>
          </div>
          <div
            onClick={handleOpen}
            className={styles.menu__icon}
            id="menu-icon">
            <i className="fa-solid fa-bars"></i>
          </div>
        </div>

        <div className={styles.nav__container__1}>
          <Nav user={user} notification={notification} />
        </div>
      </div>
      {isOpen && (
        <div className={styles.nav__container__2} id="nav-container-2">
          <Nav user={user} notification={notification} />
        </div>
      )}
    </div>
  );
};

export default AsideUI;
