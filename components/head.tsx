import Head from "next/head";

/**
 * The props for the head component.
 */
interface RefreshHeadProps {
  /**
   * The part after "2022 Design Refresh -" in the title.
   */
  subTitle: string;

  /**
   * The meta description.
   */
  description: string;

  /**
   * The image URL.
   */
  imageUrl?: string;
}

const DEFAULT_IMAGE: string = (
  (process.env["NEXT_PUBLIC_AUTH0_REDIRECT_URI"] || "") + "/logo/temp_social.png"
);

/**
 * A reusable head element for social media and SEO.
 *
 * @param {RefreshHeadProps} props the props
 * @returns {JSX.Element} the element
 * @constructor
 */
export const RefreshHead = (props: RefreshHeadProps): JSX.Element => {
  return (
    <Head>
      <title>2022 Design Refresh - {props.subTitle}</title>

      <meta name="viewport" content="initial-scale=1.0, width=device-width" />

      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

      <meta name="theme-color" content="#7C7CE0" />

      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />

      <meta property="og:site_name" content="Design Refresh" />
      <meta property="og:title" content="Design Refresh" />
      <meta name="twitter:title" content="Design Refresh" />

      <meta property="og:url" content="https://refresh.fiveclawd.com/" />
      <meta name="twitter:url" content="https://refresh.fiveclawd.com/" />

      <meta name="description" content={props.description} />
      <meta property="og:description" content={props.description} />
      <meta name="twitter:description" content={props.description} />

      <meta property="og:image" content={props.imageUrl || DEFAULT_IMAGE} />
      <meta name="twitter:image" content={props.imageUrl || DEFAULT_IMAGE} />
    </Head>
  );
};
