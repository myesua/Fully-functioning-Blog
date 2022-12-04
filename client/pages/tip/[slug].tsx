import axios from 'axios';
import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';

const SingleTip = dynamic(() => import('../../components/single/singleTip'), {
  ssr: false,
});

const TipSlug = ({ tip }: any) => {
  return <SingleTip tip={tip} />;
};

export async function getStaticPaths() {
  // Call an external API endpoint to get posts

  const response = await axios(`${process.env.API_URI}/tips`);
  const tips = await response.data.tips;
  // Get the paths we want to pre-render based on posts

  const paths = tips.map((tip: { slug: string }) => ({
    params: { slug: tip.slug },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

// This also gets called at build time
export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params;

  const response = await axios(
    `${process.env.API_URI}/tips/tip/${params?.slug}`,
  );
  const tip = response.data.tip;

  // Pass post data to the page via props
  return { props: { tip }, revalidate: 1 };
};

export default TipSlug;
