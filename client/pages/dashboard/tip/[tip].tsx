import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { GetStaticProps } from 'next';
import styles from '../styles.module.css';

import dynamic from 'next/dynamic';
import { Context } from '../../../context/context';

const SingleTip = dynamic(
  () => import('../../../components/dashboard/single/tip'),
  {
    ssr: false,
  },
);

const SingleTipRoute = ({ tip }) => {
  const { auth, dispatch } = useContext(Context);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res_ = await axios.get(`${process.env.USER_DASHBOARD_URL}`, {
          withCredentials: true,
        });
        setUser(res_.data.user);
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
  return <SingleTip user={user} tip={tip} />;
};

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await axios.get(`${process.env.TIPS_URL}`, {
    withCredentials: true,
  });
  const tips = await res.data.tips;

  // Get the paths we want to pre-render based on posts
  const paths = tips.map((tip: { slug: string }) => ({
    params: { tip: tip.slug },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

// This also gets called at build time
export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params;

  const res = await axios.get(`${process.env.TIPS_URL}/tip/${params?.tip}`, {
    withCredentials: true,
  });
  const tip = res.data.tip;

  // Pass post data to the page via props
  return { props: { tip }, revalidate: 1 };
};

export default SingleTipRoute;
