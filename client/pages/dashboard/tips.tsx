import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AsideUI from '../../components/dashboard/aside';
import UserTipsUI from '../../components/dashboard/articles/tips';
import { Context } from '../../context/context';
import styles from './styles.module.css';

const UserTipsRoute = () => {
  const { auth, dispatch } = useContext(Context);

  const [user, setUser] = useState(null);
  const [tips, setTips] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res_ = await axios.get(`${process.env.USER_DASHBOARD_URL}`, {
          withCredentials: true,
        });
        setUser(res_.data.user);
        setTips(res_.data.tips);
        setNotification(res_.data.notification);
      } catch (err) {
        dispatch({ type: 'LOGOUT' });
        window.location.reload();
      }
    };
    auth === 'true'
      ? getUser()
      : setTimeout(() => window.location.replace('/login'), 4000);
  }, []);

  if (!user) {
    return (
      <div className={styles.redirect}>
        Checking for an authenticated session...
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.aside}>
          <AsideUI user={user} notification={notification} />
        </div>
        <div className={styles.main}>
          <UserTipsUI tips={tips} />
        </div>
      </div>
    </div>
  );
};

export default UserTipsRoute;
