import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AsideUI from '../../components/dashboard/aside';
import TasksUI from '../../components/dashboard/tasks';
import Create from '../../components/dashboard/write/new_post';
import { Context } from '../../context/context';
import styles from './styles.module.css';

const TasksRoute = () => {
  const { auth, dispatch } = useContext(Context);

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const res = await axios.get(`${process.env.ADMIN_URL}/tasks`, {
          withCredentials: true,
        });
        setTasks(res.data.pending);
      } catch (err) {
        console.log(err);
      }
    };
    getTasks();
    const getUser = async () => {
      try {
        const res_ = await axios.get(`${process.env.USER_DASHBOARD_URL}`, {
          withCredentials: true,
        });
        setUser(res_.data.user);
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
          <TasksUI tasks={tasks} />
        </div>
      </div>
    </div>
  );
};

export default TasksRoute;
