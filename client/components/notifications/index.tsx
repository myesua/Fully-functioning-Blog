import React from 'react';
import NotificationUI from '../dashboard/notification';
import styles from './styles.module.css';

const NotificationsUI = ({ notification }) => {
  return (
    <div className={styles.notification__container} id="notification-page">
      <div className={styles.notification}>
        {notification?.alerts
          .map((a: { title: string; text: string }, index: number) => {
            const pending = (
              <i
                className="fa-solid fa-circle-info"
                style={{ color: 'var(--color-secondary)' }}></i>
            );
            const approved = (
              <i
                className="fa-solid fa-circle-check"
                style={{ color: '#3e9462' }}></i>
            );
            const rejected = (
              <i
                className="fa-solid fa-circle-exclamation"
                style={{ color: '#eda03c' }}></i>
            );
            const security = (
              <i
                className="fa-solid fa-circle-exclamation"
                style={{ color: '#eda03c' }}></i>
            );

            let icon: JSX.Element;

            if (a.title == 'New Article submitted for review') {
              icon = pending;
            } else if (a.text.match('approved') && a.text.match('titled')) {
              icon = approved;
            } else if (a.text.match('not approved') && a.text.match('titled')) {
              icon = rejected;
            } else if (a.title.match('security')) {
              icon = security;
            }

            return (
              <NotificationUI a={a} key={index} icon={icon} index={index} />
            );
          })
          .reverse()}
      </div>
    </div>
  );
};

export default NotificationsUI;
