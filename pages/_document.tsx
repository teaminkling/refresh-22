import {Head, Html, Main, NextScript} from "next/document";

/**
 * The overridden document element.
 *
 * @returns {JSX.Element} the element
 * @constructor
 */
export const Document = () => {
  // noinspection HtmlRequiredTitleElement
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans&display=swap"
          rel="stylesheet"
        />

        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        <meta name="theme-color" content="#7C7CE0" />
      </Head>
      <body className={"antialiased"}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
