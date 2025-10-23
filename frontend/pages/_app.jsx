import '../styles/globals.css'

import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="description" content="InsightSphere - Your gateway to stories, news, and insights" />
        <meta name="keywords" content="news, blog, insights, politics, culture, travel, entertainment" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}