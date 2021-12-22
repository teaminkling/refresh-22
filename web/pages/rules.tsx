import type {NextPage} from "next";
import Head from "next/head";

/**
 * The home page/gallery.
 *
 * @returns {JSX.Element} the element
 * @constructor
 */
const Rules: NextPage = () => {
  return (
    <div className={"mx-8 my-4"}>
      <Head>
        <title>2022 Design Refresh</title>

        <meta name="description" content="To be rewritten." />
      </Head>

      <h1 className={"text-4xl my-10"}>
        [RULES_VIEW]
      </h1>

      <footer />
    </div>
  );
};

export default Rules;
