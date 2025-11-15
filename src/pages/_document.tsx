import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* SEO Meta */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="TaxTrack — Smart Expense Tracking for Canadian Corporations" />
        <meta name="author" content="TaxCare4YouPC" />
        <meta name="theme-color" content="#ffffff" />

        {/* Open Graph (for social sharing) */}
        <meta property="og:title" content="TaxTrack — Smart Expense Tracking" />
        <meta property="og:description" content="Track expenses by business, category, and currency. Export CRA-ready reports with ease." />
        <meta property="og:url" content="https://taxtrack.taxcare4you.ca" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}