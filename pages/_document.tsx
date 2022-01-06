import {config, dom} from "@fortawesome/fontawesome-svg-core";
import {Head, Html, Main, NextScript} from "next/document";

// Handle some issues with Font Awesome on some browsers.

config.autoAddCss = false;

const DEFAULT_IMAGE: string = (
  (process.env["NEXT_PUBLIC_AUTH0_REDIRECT_URI"] || "") + "/logo/temp_social.png"
);

const DEFAULT_DESCRIPTION = (
  "The 2022 Design Refresh is a weekly design/art/creative challenge hosted on Twitch by " +
  "CindryTuna AKA FiveClawD, sponsored by Inkling Interactive."
);

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

        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />

        <meta name="description" content={DEFAULT_DESCRIPTION} />
        <meta property="og:description" content={DEFAULT_DESCRIPTION} />
        <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />

        <meta property="og:image" content={DEFAULT_IMAGE} />
        <meta name="twitter:image" content={DEFAULT_IMAGE} />

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
