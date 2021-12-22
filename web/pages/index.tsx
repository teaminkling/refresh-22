import type {NextPage} from "next";
import Head from "next/head";

/**
 * The home page/gallery.
 *
 * @returns {JSX.Element} the element
 * @constructor
 */
const Home: NextPage = () => {
  return (
    <div className={"mx-8 my-4"}>
      <Head>
        <title>2022 Design Refresh</title>

        <meta name="description" content="To be rewritten." />
      </Head>

      <h1 className={"text-4xl my-10"}>
        [GALLERY_VIEW]
      </h1>

      <footer />
    </div>
  );
};

export default Home;
