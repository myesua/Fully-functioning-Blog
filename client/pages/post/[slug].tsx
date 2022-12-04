import axios from 'axios';
import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';

const SinglePost = dynamic(() => import('../../components/single/singlePost'), {
  ssr: false,
});

const PostSlug = ({ post, user }: any) => {
  return <SinglePost post={post} user={user} />;
};

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await axios(`${process.env.API_URI}/posts`);
  const posts = await res.data.posts;

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post: { slug: string }) => ({
    params: { slug: post.slug },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

// This also gets called at build time
export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params;

  const res = await axios(`${process.env.API_URI}/posts/post/${params?.slug}`);
  const post = res.data.post;

  // Pass post data to the page via props
  return { props: { post }, revalidate: 1 };
};

export default PostSlug;
