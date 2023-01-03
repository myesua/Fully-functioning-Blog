import '../styles/globals.css';
// import type { AppProps } from 'next/app';
import Head from 'next/head';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AuthProvider, Context } from '../context/context';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const { auth } = useContext(Context);

  // useEffect(() => {
  //   if (auth === 'true') {
  //     const getUsers = async () => {
  //       try {
  //         const res = await axios.get(`${process.env.API_URI}/auth/refresh`, {
  //           withCredentials: true,
  //         });
  //         axios.defaults.headers.common[
  //           'Authorization'
  //         ] = `Bearer ${res.data.hash}`;
  //         const response = await axios.get(
  //           `${process.env.API_URI}/user/dashboard`,
  //           {
  //             headers: {
  //               'Content-type': 'application/json',
  //               Authorization: 'Bearer ' + res.data.hash,
  //             },
  //             withCredentials: true,
  //           },
  //         );

  //         setUser(response.data.user);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     };

  //     getUsers();
  //   }
  // }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <AuthProvider value={{ auth: false }}>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
  // return (
  //   <>
  //     <Head>
  //       <meta charSet="UTF-8" />
  //       <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  //     </Head>
  //     <AuthProvider>
  //       <Component value={{ auth: false }} {...pageProps} />
  //     </AuthProvider>
  //   </>
  // );
}

export default MyApp;
