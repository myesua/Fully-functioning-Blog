import React from 'react';
import styles from '../../pages/dashboard/styles.module.css';
import AsideUI from '../../components/dashboard/aside';
import Dashboard from '../dashboard/main_';

const DashboardUI = ({
  user,
  posts,
  tips,
  pending,
  rejected,
  notification,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.aside}>
          <AsideUI user={user} notification={notification} />
        </div>
        <div className={styles.main}>
          <Dashboard
            user={user}
            posts={posts}
            tips={tips}
            pending={pending}
            rejected={rejected}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardUI;
