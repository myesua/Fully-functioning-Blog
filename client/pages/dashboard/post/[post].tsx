import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { GetStaticProps } from 'next';
import styles from '../styles.module.css';

import dynamic from 'next/dynamic';
import { Context } from '../../../context/context';

const Single = dynamic(
  () => import('../../../components/dashboard/single/post'),
  {
    ssr: false,
  },
);

const SingleRoute = ({ post }) => {
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
  return <Single user={user} post={post} />;
};

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await axios.get(`${process.env.POSTS_URL}`, {
    withCredentials: true,
  });
  const posts = await res.data.posts;

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post: { slug: string }) => ({
    params: { post: post.slug },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

// This also gets called at build time
export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params;

  const res = await axios.get(`${process.env.POSTS_URL}/post/${params?.post}`, {
    withCredentials: true,
  });
  const post = res.data.post;

  // Pass post data to the page via props
  return { props: { post }, revalidate: 1 };
};

export default SingleRoute;
