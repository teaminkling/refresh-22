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

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />

        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#7C7CE0" />

        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />

        <meta property="og:site_name" content="Design Refresh" />
        <meta property="og:title" content="Design Refresh" />
        <meta name="twitter:title" content="Design Refresh" />

        <meta property="og:url" content="https://refresh.fiveclawd.com/" />
        <meta name="twitter:url" content="https://refresh.fiveclawd.com/" />

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
