import type {NextPage} from "next";
import Head from "next/head";

/**
 * @returns {JSX.Element} the element
 * @constructor
 */
const About: NextPage = () => {
  return (
    <div className={"mx-8 my-4"}>
      <Head>
        <title>2022 Design Refresh</title>

        <meta name="description" content="To be rewritten." />
      </Head>

      <div className={"text-xl p-8"} style={{maxWidth: 1024}}>
        <h1 className={"text-6xl py-3"}>
          About the Refresh
        </h1>

        <p className={"py-3"}>
          Following the success of the 2021 Design Refresh, the sequel - the 2022 Design Refresh -
          is a community-centered weekly creative art challenge.
        </p>
        <p className={"py-3"}>
          It runs from the <b>1st January 2022</b> to ??? and <b>accepts submissions from all
          creative media</b>!
        </p>
        <p className={"py-3"}>
          Many creators work to create submissions according to a theme every week. At the end of
          each week, <b>a showcase by CindryTuna (AKA FiveClawD)</b> will broadcast live on
          Twitch for the community to enjoy.
        </p>
        <p className={"py-3"}>
          The hashtag for the Refresh is <b>#2022DesignRefresh</b>.
        </p>

        <h2 className={"text-4xl py-3"}>
          Our Team
        </h2>

        <p className={"py-3"}>
          This project was produced and sponsored by <b>Inkling Interactive</b>.
        </p>

        <ul className={"list-disc px-6 py-3"}>
          <li><p><b>Director</b>: CindryTuna</p></li>
          <li><p><b>Engineer</b>: papapastry</p></li>
        </ul>

        <p className={"py-3"}>
          Thanks also to the various co-hosts on the weekly Friday showcases!
        </p>
      </div>

      <footer />
    </div>
  );
};

export default About;
