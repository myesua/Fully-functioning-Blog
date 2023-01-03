import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Posts from '../components/posts/posts';
import axios, { AxiosPromise, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';

const Home: NextPage = ({ user }: any) => {
  const [posts, setPosts] = useState([]);
  const [tips, setTips] = useState([]);
  const { asPath } = useRouter();

  useEffect(() => {
    const getPosts = async () => {
      const res = await axios.get(`${process.env.POSTS_URL}${asPath}`, {
        withCredentials: true,
      });
      setPosts(res.data.posts);
    };
    const getTips = async () => {
      const res = await axios.get(`${process.env.TIPS_URL}${asPath}`, {
        withCredentials: true,
      });
      setTips(res.data.tips);
    };
    getPosts();
    getTips();
  }, [asPath, posts, tips]);

  return <Posts posts={posts} tips={tips} user={user} />;
};

export default Home;
