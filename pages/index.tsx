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
    <div>
      <Head>
        <title>2022 Design Refresh</title>

        <meta name="description" content="To be rewritten." />
      </Head>

      <main>
        <Sidebar />
      </main>

      <footer>
        This is where the footer would go.
      </footer>
    </div>
  );
};

export default Home;
