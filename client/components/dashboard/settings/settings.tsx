import React, { useEffect, useRef, useState } from 'react';
import styles from './settings.module.css';
import Avatar from '../../../public/images/resetavatar.png';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';

const Settings = ({ user }) => {
  const [info, setInfo] = useState('');
  const [info2, setInfo2] = useState('');
  const [info3, setInfo3] = useState('');
  const mRef = useRef<HTMLSpanElement>(null);
  const m2Ref = useRef<HTMLSpanElement>(null);
  const m3Ref = useRef<HTMLSpanElement>(null);
  const nRef = useRef<HTMLSpanElement>(null);

  const mRefEl = mRef.current;
  const m2RefEl = m2Ref.current;
  const m3RefEl = m3Ref.current;
  const nRefEl = nRef.current;

  const [image, setImage] = useState(null);
  const [picture, setPicture] = useState(user?.profilePicture);
  const [firstname, setFirstName] = useState(user?.firstname);
  const [lastname, setLastName] = useState(user?.lastname);
  const [phone, setPhone] = useState(user?.phone);
  const [url, setUrl] = useState(user?.url);
  const [bio, setBio] = useState(user?.bio);

  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');

  const [email, setEmail] = useState('');

  const router = useRouter();

  useEffect(() => {
    const container = document.querySelector('#settings-container');
    const inputBoxes = Array.from(container.querySelectorAll('#input-box'));

    inputBoxes.forEach((box) =>
      box.addEventListener('focusin', (e: any) => {
        const el = e.target.previousElementSibling as HTMLLabelElement;
        el.setAttribute('style', 'color: var(--text-color-secondary)');
      }),
    );

    inputBoxes.forEach((box) =>
      box.addEventListener('focusout', (e: any) => {
        const el = e.target.previousElementSibling as HTMLLabelElement;
        el.removeAttribute('style');
      }),
    );
  }, []);

  const updateProfileImage = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `${process.env.UPLOAD_IMAGE_URL}/${user._id}`,
        {
          profilePicture: image,
        },
        { withCredentials: true },
      );
      setInfo(res.data.message);
      setPicture(res.data.url);
    } catch (err) {
      console.log(err);
      setInfo(err.response.data.message.message);
    }
  };

  const getImage = (e: { target: HTMLInputElement }) => {
    const files = (e.target as HTMLInputElement).files;
    const el = e.target.nextElementSibling as HTMLSpanElement;
    if (files !== null) {
      let file = files[0];
      encodeImageFileAsURL(file);
      el.innerText = file.name;
      el.style.color = 'var(--bg-color-primary)';
    } else {
      setInfo(
        'There was a problem getting the file from your device. Please try again.',
      );
    }
  };

  const encodeImageFileAsURL = (element) => {
    var reader = new FileReader();
    reader.onloadend = function () {
      setImage(reader.result);
    };
    reader.readAsDataURL(element);
  };

  const updateProfile = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${process.env.UPDATE_PROFILE_URL}/${user._id}`,
        {
          firstname,
          lastname,
          phone,
          url,
          bio,
        },
        { withCredentials: true },
      );
      setInfo(res.data.message);
    } catch (err) {
      setInfo(err.response.data.message);
    }
  };

  const updateEmail = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.patch(`${process.env.UPDATE_URL}/${user._id}`, {
        email: user.email,
        password,
        newEmail,
      });
      setInfo2(res.data.message);
    } catch (err) {
      setInfo2(err.response.data.message);
    }
  };

  const handleReset = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.RECOVERY_URL}`, {
        email: email,
      });
      setInfo3(res.data.message);
    } catch (err) {
      setInfo3(err.response.data.message);
    }
  };

  const infoStyle =
    info || info2 || info3
      ? `${styles.message} ${styles.animate}`
      : styles.message;

  // const infoStyle2 = info2
  //   ? `${styles.message} ${styles.animate}`
  //   : styles.message;

  // const infoStyle3 = info3
  //   ? `${styles.message} ${styles.animate}`
  //   : styles.message;

  if (info) {
    nRefEl.style.display = 'none';
    mRefEl.classList.add('animate');
    mRefEl.addEventListener(
      'animationend',
      () => (mRefEl.style.display = 'none'),
    );
  }

  if (info2) {
    m2RefEl.classList.add('animate');
    m2RefEl.addEventListener(
      'animationend',
      () => (m2RefEl.style.display = 'none'),
    );
  }

  if (info3) {
    m3RefEl.classList.add('animate');
    m3RefEl.addEventListener(
      'animationend',
      () => (m3RefEl.style.display = 'none'),
    );
  }
  return (
    <div className={styles.settings_container} id="settings-container">
      <form className={styles.settings} onSubmit={updateProfile}>
        <div className={styles.title__first}>
          Profile details
          <span className={infoStyle} ref={mRef} id="message">
            {info && <i className="fa-solid fa-check"></i>}
            <span>{info}</span>
          </span>
        </div>
        <div className={styles.update_image}>
          <label className={styles.profile__image}>
            <Image
              className={styles.image}
              src={picture}
              width={60}
              height={60}
              alt="image"
              priority={true}
            />
            <input
              className={styles.image__input}
              type="file"
              accept="image/png, image/jpg, image/gif, image/jpeg"
              id="input-file-box"
              onChange={getImage}
            />
            <span ref={nRef}></span>
          </label>
          <button onClick={updateProfileImage} type="submit">
            Update Profile Image
          </button>
        </div>
        <div className={styles.parent}>
          <div className={styles.wrapper}>
            <label id="label">
              First Name <span style={{ color: '#f00' }}>*</span>
            </label>
            <input
              className={styles.input__box}
              onChange={(e) => setFirstName(e.target.value)}
              id="input-box"
              type="text"
              name="firstname"
              defaultValue={firstname}
              required
            />
          </div>
          <div className={styles.wrapper}>
            <label id="label">
              Last Name <span style={{ color: '#f00' }}>*</span>
            </label>
            <input
              className={styles.input__box}
              onChange={(e) => setLastName(e.target.value)}
              id="input-box"
              type="text"
              name="lastname"
              defaultValue={lastname}
              required
            />
          </div>
        </div>
        <div className={styles.parent}>
          <div className={styles.wrapper}>
            <label className={styles.phone} id="label">
              Phone Number
            </label>
            <input
              className={styles.input__box__phone}
              onChange={(e) => setPhone(e.target.value)}
              id="input-box"
              type="tel"
              name="phone"
              pattern="[0-9]{11}"
              defaultValue={phone}
            />
          </div>
          <div className={styles.wrapper}>
            <label className={styles.phone} id="label">
              LinkedIn Profile URL
            </label>
            <input
              className={styles.input__box}
              onChange={(e) => setUrl(e.target.value)}
              id="input-box"
              type="url"
              name="linkedin-url"
              pattern="https://.*"
              defaultValue={url}
            />
          </div>
        </div>
        <div className={styles.wrapper}>
          <label>Bio</label>
          <textarea
            rows={10}
            cols={10}
            className={styles.bio}
            defaultValue={bio}
            onChange={(e) => setBio(e.target.value)}></textarea>
        </div>
        <div className={styles.save_change}>
          <button type="submit">Save Changes</button>
        </div>
      </form>

      <form className={styles.settings} onSubmit={updateEmail}>
        <div className={styles.title}>
          <span>E-mail & Login</span>
          <i className="fa-solid fa-lock"></i>
        </div>
        <span className={infoStyle} ref={m2Ref}>
          {info2 && <i className="fa-solid fa-check"></i>}
          <span>{info2}</span>
        </span>
        <div className={styles.wrapper}>
          <label>
            Your e-mail address (Login e-mail){' '}
            <span style={{ color: '#f00' }}>*</span>
          </label>
          <input
            className={styles.input__box__email}
            id="input-box"
            type="email"
            name="email"
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>
        <div className={styles.wrapper}>
          <label>To save changes to your E-mail, enter your password:</label>
          <div className={styles.hidden__text}>
            Your Password <span style={{ color: '#f00' }}>*</span>
          </div>
          <input
            className={styles.input__box__password}
            id="input-box"
            placeholder="Your Password"
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.save_change}>
          <button type="submit">Save Changes</button>
        </div>
      </form>

      <form className={styles.settings} onSubmit={handleReset}>
        <div className={styles.title}>
          <span>Change Password</span>
          <i className="fa-solid fa-lock"></i>
        </div>
        <span className={infoStyle} ref={m3Ref}>
          {info3 && <i className="fa-solid fa-check"></i>}
          <span>{info3}</span>
        </span>
        <div className={styles.wrapper__password}>
          <input
            className={styles.input__box}
            placeholder="Email"
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* <input
            className={styles.input__box}
            placeholder="New Password"
            type="password"
            name="newPassword"
          />
          <input
            className={styles.input__box}
            placeholder="Confirm Password"
            type="password"
            name="confirmPassword"
          /> */}
        </div>
        <div className={styles.save_change}>
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
