import {config, dom} from "@fortawesome/fontawesome-svg-core";
import {Head, Html, Main, NextScript} from "next/document";

// Handle some issues with Font Awesome on some browsers.

config.autoAddCss = false;


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

        <style>{dom.css()}</style>
      </Head>
      <body className={"antialiased"}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
