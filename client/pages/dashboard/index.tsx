import React, { useContext, useEffect, useState } from 'react';
import styles from './styles.module.css';
// import DashboardUI from '../components/dashboard';
import { Context } from '../../context/context';

import axios from 'axios';
import dynamic from 'next/dynamic';

const DashboardUI = dynamic(() => import('../../components/dashboard/main'), {
  ssr: false,
});

const Dashboard = () => {
  const { auth, dispatch } = useContext(Context);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [tips, setTips] = useState([]);
  const [pending, setPending] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res_ = await axios.get(`${process.env.USER_DASHBOARD_URL}`, {
          withCredentials: true,
        });
        setUser(res_.data.user);
        setPosts(res_.data.posts);
        setTips(res_.data.tips);
        setPending(res_.data.pending);
        setRejected(res_.data.rejected);
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
    <div>
      <DashboardUI
        user={user}
        posts={posts}
        tips={tips}
        pending={pending}
        rejected={rejected}
        notification={notification}
      />
    </div>
  );
};

export default Dashboard;
