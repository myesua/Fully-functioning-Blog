import axios from 'axios';
import { GetServerSideProps, GetStaticProps } from 'next';
import AccountConfirmed from '../../components/account/confirm';

const AccountConfirmedSlug = ({ message }) => {
  return <AccountConfirmed message={message} />;
};

export async function getStaticPaths() {
  // Call an external API endpoint to get verify token
  const res = await axios.get(`${process.env.API_URI}/auth/`, {
    withCredentials: true,
  });
  const token = await res.data.token;

  // Get the paths we want to pre-render based on token
  const paths = {
    params: { slug: token.slug },
  };

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

// This also gets called at build time
export const getStaticProps: GetServerSideProps = async (context) => {
  const params = context.params;

  const res = await axios(
    `${process.env.API_URI}/auth/verify/${params?.slug}`,
    {
      withCredentials: true,
    },
  );
  const message = res.data.message;

  // Pass token data to the page via props
  return { props: { message }, revalidate: 1 };
};

export default AccountConfirmedSlug;
