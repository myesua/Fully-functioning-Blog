import Image from 'next/image';
import Link from 'next/link';
import React, { Key, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import styles from '../styles/dashboard.module.css';

import Camera from '../public/camera.svg';
import GoIcon from '../public/go_icon.svg';
import ErrorInfoIcon from '../public/errorinfo.svg';
import SuccessInfoIcon from '../public/successinfo.svg';

import axios from 'axios';

import { Context } from '../context/context';
import Post from '../components/post/post';
import Tips from '../components/tip/tip';

const Dashboard = ({ user, posts, tips }) => {
  const router = useRouter();

  const author = user && user.firstname + ' ' + user.lastname;

  const [hydrated, setHydrated] = useState(false);

  const [firstname, setFirstname] = useState(user?.firstname);
  const [lastname, setLastname] = useState(user?.lastname);
  const [email, setEmail] = useState(user?.email);
  const [pPicture, setPPicture] = useState(user?.profilePicture);
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setHydrated(true);
  }, [hydrated]);

  useEffect(() => {
    // Instructions for file upload element
    const inputBox = document.getElementById(
      'input-file-box',
    ) as HTMLInputElement;
    const imageNameBox = document.getElementById(
      'image-name',
    ) as HTMLSpanElement;
    const guide = document.getElementById('guide') as HTMLSpanElement;

    inputBox.addEventListener('change', (e) => {
      const files = (e.target as HTMLInputElement).files;

      if (files !== null) {
        let file = files[0];
        guide.style.display = 'none';
        imageNameBox.innerText = file.name;
        imageNameBox.style.color = '#396afc';
      } else {
        console.log('There was a problem uploading. Please try again.');
      }
    });

    // Toggle display between tabs
    const profileTab = document.getElementById('profile-tab') as HTMLDivElement;
    const profilePage = document.getElementById(
      'profile-page',
    ) as HTMLDivElement;
    const homeTab = document.getElementById('home-tab') as HTMLDivElement;
    const homePage = document.getElementById('home-page') as HTMLDivElement;
    const securityTab = document.getElementById(
      'security-tab',
    ) as HTMLDivElement;
    const securityPage = document.getElementById(
      'security-page',
    ) as HTMLDivElement;

    const smHomeTab = document.getElementById('sm-home-tab') as HTMLDivElement;
    const smProfileTab = document.getElementById(
      'sm-profile-tab',
    ) as HTMLDivElement;
    const smSecurityTab = document.getElementById(
      'sm-security-tab',
    ) as HTMLDivElement;

    profileTab.addEventListener('click', () => {
      profilePage.style.display = 'block';
      homePage.style.display = 'none';
      securityPage.style.display = 'none';
    });
    homeTab.addEventListener('click', () => {
      homePage.style.display = 'block';
      profilePage.style.display = 'none';
      securityPage.style.display = 'none';
    });

    securityTab.addEventListener('click', () => {
      securityPage.style.display = 'block';

      homePage.style.display = 'none';
      profilePage.style.display = 'none';
    });

    smProfileTab.addEventListener('click', () => {
      profilePage.style.display = 'block';
      homePage.style.display = 'none';
      securityPage.style.display = 'none';
    });
    smHomeTab.addEventListener('click', () => {
      homePage.style.display = 'block';
      profilePage.style.display = 'none';
      securityPage.style.display = 'none';
    });

    smSecurityTab.addEventListener('click', () => {
      securityPage.style.display = 'block';
      console.log(securityPage.className);
      homePage.style.display = 'none';
      profilePage.style.display = 'none';
    });
  }, []);

  function encodeImageFileAsURL(element) {
    var reader = new FileReader();
    reader.onloadend = function () {
      console.log(reader.result);
      setPPicture(reader.result);
    };
    reader.readAsDataURL(element);
  }

  const handleUpdate = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // dispatch({ type: 'UPDATE_START' });
    try {
      const res = await axios.put(
        `${process.env.API_URI}/user/${user.id}`,
        {
          _id: user.id,
          firstname: firstname,
          lastname: lastname,
          email: email,
          profilePicture: pPicture,
        },
        { withCredentials: true },
      );
      console.log('🎉', 'Your profile has been updated successfully!');
      setIsOpen(!isOpen);
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    // dispatch({ type: 'LOGOUT' });
    router.push('/login');
  };

  const updatePassword = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${process.env.API_URI}/users/${user._id}`, {
        _id: user._id,
        oldPassword: oldPassword,
        password: password,
      });
      res.statusText = 'Your account has been successfully updated!';
      setInfo(res.statusText);
      setTimeout(function () {
        window.location.reload();
      }, 2000);
      handleLogout();
      // router.push('/account');
    } catch (err: any) {
      setError(err.response.data);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.side} id="side-nav">
        <div className={styles.side__top}>
          <div className={styles.side__top__child}>
            <div className={styles.logo}>
              <Link href="/">
                <span>
                  <a>Bechellente</a>
                </span>
              </Link>
            </div>
            <div className={styles.avatar__container}>
              {hydrated && user && (
                <Image
                  className={styles.avatar}
                  src={user.profilePicture}
                  width={120}
                  height={120}
                  layout="fixed"
                  priority
                />
              )}
            </div>
            {hydrated && <div className={styles.author__name}>{author}</div>}
            <Link href="write/new_post">
              <a>
                <div className={styles.create__link}>New Post</div>
              </a>
            </Link>
            <Link href="write/new_tip">
              <a>
                <div className={styles.create__link}>Write Tip</div>
              </a>
            </Link>
          </div>
        </div>
        <div className={styles.side__bottom}>
          <div className={styles.home__tab} id="home-tab">
            Home
          </div>
          <div className={styles.profile__tab} id="profile-tab">
            Profile
          </div>
          <div className={styles.security__tab} id="security-tab">
            Security
          </div>
          <div onClick={handleLogout}>Logout</div>
        </div>
      </div>

      <div className={styles.nav} id="nav">
        <div className={styles.nav__top}>
          <div className={styles.nav__top__child}>
            <div className={styles.top__child__first}>
              <div className={styles.top__child__first__nav}>
                <div className={styles.logo}>
                  <Link href="/">
                    <span>
                      <a>Bechellente</a>
                    </span>
                  </Link>
                </div>
                <div className={styles.nav__avatar__container}>
                  {hydrated && user && (
                    <Image
                      className={styles.nav__avatar}
                      src={user.profilePicture}
                      width={40}
                      height={40}
                      layout="fixed"
                      priority={true}
                    />
                  )}
                </div>
              </div>

              {hydrated && <div className={styles.author__name}>{author}</div>}
              <div className={styles.nav__write}>
                <Link href="write/new_post">
                  <a>
                    <div className={styles.nav__create__link}>New Post</div>
                  </a>
                </Link>
                <Link href="write/new_tip">
                  <a>
                    <div className={styles.nav__create__link}>Write Tip</div>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.nav__bottom}>
          <div id="sm-home-tab">Home</div>
          <div id="sm-profile-tab">Profile</div>
          <div id="sm-security-tab">Security</div>
          <div onClick={handleLogout}>Logout</div>
        </div>
      </div>

      {isOpen && (
        <div className={styles.blur__overlay}>
          <div className={styles.modal}>
            Your profile has been updated, 🎉!
            <br />
            <br />
            <div className={styles.go__button__container}>
              <Image
                src={GoIcon}
                width={40}
                height={40}
                className={styles.go__button}
                onClick={() => setIsOpen(!isOpen)}
                alt=""
                priority={true}
              />
            </div>
          </div>
        </div>
      )}
      <div className={styles.main}>
        <div className={styles.banner__container}>
          {hydrated && user && (
            <Image
              src={user.bannerImage}
              width={3300}
              height={500}
              objectFit="cover"
              alt=""
              priority={true}
            />
          )}
        </div>

        <div className={styles.navbar__container} id="profile-page">
          <div className={styles.profile__image__container}>
            <label className={styles.profile__image}>
              <Image
                src={Camera}
                width={50}
                height={50}
                layout="fixed"
                alt=""
                priority={true}
              />
              <input
                className={styles.image__input}
                type="file"
                accept="image/png, image/jpg, image/gif, image/jpeg"
                id="input-file-box"
                onChange={(e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files !== null) {
                    let file = files[0];
                    encodeImageFileAsURL(file);
                  } else {
                    console.log(
                      'There was a problem uploading. Please try again.',
                    );
                  }
                }}
              />
              <span id="image-name"></span>
            </label>
            <span id="guide">Change your profile picture</span>
          </div>

          <div className={styles.profile__other__elements}>
            <div>
              {hydrated && user && (
                <input
                  type="text"
                  className={styles.input__text__box}
                  defaultValue={user.firstname}
                  readOnly
                  onClick={(e: any) => (e.target.readOnly = false)}
                  onChange={(e) => {
                    setFirstname(e.target.value);
                  }}
                  title="First Name"
                />
              )}
            </div>
            <div>
              {hydrated && user && (
                <input
                  type="text"
                  className={styles.input__text__box}
                  defaultValue={user.lastname}
                  readOnly
                  onClick={(e: any) => (e.target.readOnly = false)}
                  onChange={(e) => {
                    setLastname(e.target.value);
                  }}
                  title="Last Name"
                />
              )}
            </div>
            <div>
              {hydrated && user && (
                <input
                  type="email"
                  className={styles.input__text__box}
                  defaultValue={user.email}
                  readOnly
                  onClick={(e: any) => (e.target.readOnly = false)}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  title="Email"
                />
              )}
            </div>
            <div>
              <input
                type="password"
                className={styles.input__text__box}
                value="********"
                readOnly
                title="You cannot edit your password here, please use the security tab instead."
              />
            </div>
          </div>
          <div className={styles.submit__button__container}>
            <button className={styles.submit__button} onClick={handleUpdate}>
              Update
            </button>
          </div>
        </div>

        <div className={styles.navbar__container} id="security-page">
          <div className={styles.profile__other__elements}>
            <div>
              <input
                type="password"
                className={styles.input__text__box}
                placeholder="Old Password"
                readOnly
                onClick={(e: any) => (e.target.readOnly = false)}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                }}
                title="Old Password"
              />
            </div>
            <div>
              <input
                type="password"
                className={styles.input__text__box}
                placeholder="New Password"
                readOnly
                onClick={(e: any) => (e.target.readOnly = false)}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                title="New Password"
              />
            </div>
          </div>
          <div className={styles.submit__button__container}>
            <button className={styles.submit__button} onClick={updatePassword}>
              Update
            </button>
          </div>
          {error !== '' ? (
            <div className={styles.alert__box__container}>
              <div className={styles.alert__error__box}>
                <span>
                  <Image
                    src={ErrorInfoIcon}
                    width={20}
                    height={20}
                    layout="fixed"
                    alt=""
                    priority
                  />
                </span>
                <span>{error}</span>
              </div>
            </div>
          ) : info !== '' ? (
            <div className={styles.alert__box__container}>
              <div className={styles.alert__info__box}>
                <span>
                  <Image
                    src={SuccessInfoIcon}
                    width={20}
                    height={20}
                    layout="fixed"
                    alt=""
                    priority
                  />
                </span>
                <span className={styles.alert__info}>{info}</span>
              </div>
            </div>
          ) : (
            false
          )}
        </div>

        <div className={styles.home__page} id="home-page">
          <div>
            <h1 className={styles.posts__heading}>My Articles</h1>
            {hydrated && (
              <div className={styles.posts__main}>
                {typeof tips !== 'string'
                  ? posts.map((post: { title: string }, index: Key) => {
                      let slug = post.title.toLowerCase().split(' ').join('-');
                      return (
                        <Link href={`/post/${slug}`} key={index}>
                          <a className={styles.post}>
                            <Post post={post} />
                          </a>
                        </Link>
                      );
                    })
                  : ''}
              </div>
            )}
          </div>
          <div className={styles.posts__main}>
            {typeof tips !== 'string'
              ? tips.map((tip: { title: string }, index: Key) => {
                  let slug = tip.title.toLowerCase().split(' ').join('-');
                  return (
                    <Link href={`/tip/${slug}`} key={index}>
                      <a className={styles.post}>
                        <Tips tip={tip} />
                      </a>
                    </Link>
                  );
                })
              : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
