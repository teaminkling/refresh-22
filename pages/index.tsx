import type {NextPage} from "next";
import Head from "next/head";
import Sidebar from "../components/sidebar";

/**
 * The home page/gallery.
 *
 * @returns {JSX.Element} the element
 * @constructor
 */
const Home: NextPage = () => {
  return (
    <div className={"antialiased"}>
      <Head>
        <title>2022 Design Refresh</title>
        <meta name="description" content="To be rewritten." />
      </Head>

      <div className={"md:flex md:flex-row"}>
        <aside className={"md:h-screen sticky top-0"}>
          <Sidebar />
        </aside>
        <main className={"mx-8 my-4"}>
          <h1 className={"text-4xl my-10"}>
            ...
          </h1>
        </main>
      </div>

      <footer />
    </div>
  );
};

export default Home;
