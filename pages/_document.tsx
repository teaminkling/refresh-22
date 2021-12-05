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
      </Head>
      <body>
        <Main />

        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
