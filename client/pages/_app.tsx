import '../styles/globals.css';
// import type { AppProps } from 'next/app';
import { GetStaticProps } from 'next';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
