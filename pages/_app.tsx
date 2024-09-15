import "@fortawesome/fontawesome-svg-core/styles.css";
import type {AppProps} from "next/app";
import Head from "next/head";
import {FC, useEffect} from "react";
import {useStore} from "react-redux";
import {Store} from "redux";
import {persistStore} from "redux-persist";
import {PersistGate} from "redux-persist/integration/react";
import Layout from "../components/layout";
import {wrapper} from "../store/store";
import "../styles/globals.css";

// Validate required environment variables before continuing.

const NODE_ENV: string = process.env.NODE_ENV;

const NEXT_PUBLIC_API_URL: string = process.env.NEXT_PUBLIC_API_URL || "";

if (!NODE_ENV) {
  throw new Error("It is not known if this is production or not.");
}

if (!NEXT_PUBLIC_API_URL) {
  throw new Error("API URL is not known.");
}

/**
 * Main app component that provides access to the Redux store.
 *
 * @param Component the component
 * @param {any} pageProps the page props
 * @returns {JSX.Element} the {@link JSX.Element}
 * @constructor
 */
const WrappedApp: FC<AppProps> = ({Component, pageProps}: AppProps) => {
  const store: Store = useStore();

  useEffect(() => {
    console.log("%cDon't paste anything here.", "color: red; font-size: 32px");

    console.log("...except if you really know what you're doing.");
    console.log("This console can allow would-be attackers to pretend to be you.");
    console.log("Read about Self-XSS here: https://en.wikipedia.org/wiki/Self-XSS");
  }, []);

  // noinspection HtmlRequiredTitleElement
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" key={"viewport"} />
      </Head>

      <PersistGate loading={null} persistor={persistStore(store)}>
        {
          () => (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )
        }
      </PersistGate>
    </>
  );
};

export default wrapper.withRedux(WrappedApp);
