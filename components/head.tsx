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

      <meta name="description" content={props.description} />
      <meta property="og:description" content={props.description} />
      <meta name="twitter:description" content={props.description} />

      <meta property="og:image" content={props.imageUrl || DEFAULT_IMAGE} />
      <meta name="twitter:image" content={props.imageUrl || DEFAULT_IMAGE} />
    </Head>
  );
};
