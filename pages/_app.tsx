/**
 * The main app.
 */

import {Auth0Provider} from "@auth0/auth0-react";
import type {AppProps} from "next/app";
import Head from "next/head";
import {FC} from "react";
import {useStore} from "react-redux";
import {Store} from "redux";
import {persistStore} from "redux-persist";
import {PersistGate} from "redux-persist/integration/react";
import Sidebar from "../components/sidebar";
import {wrapper} from "../store/store";
import "../styles/globals.css";

// Validate required environment variables before continuing.

const NODE_ENV: string = process.env.NODE_ENV;

const NEXT_PUBLIC_API_URL: string = process.env.NEXT_PUBLIC_API_URL || "";

const NEXT_PUBLIC_AUTH0_DOMAIN: string = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || "";
const NEXT_PUBLIC_AUTH0_CLIENT_ID: string = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || "";
const NEXT_PUBLIC_AUTH0_REDIRECT_URI: string = process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI || "";
const NEXT_PUBLIC_AUTH0_AUDIENCE: string = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || "";

if (!NODE_ENV) {
  throw new Error("It is not known if this is production or not.");
}

if (!NEXT_PUBLIC_API_URL) {
  throw new Error("API URL is not known.");
}

if (
  !NEXT_PUBLIC_AUTH0_DOMAIN
  || !NEXT_PUBLIC_AUTH0_CLIENT_ID
  || !NEXT_PUBLIC_AUTH0_REDIRECT_URI
  || !NEXT_PUBLIC_AUTH0_AUDIENCE
) {
  throw new Error("One or more of the Auth0 envars is/are not set.");
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

  return (
    <>
      <Head>
        {/* eslint-disable-next-line @next/next/no-title-in-document-head */}
        <title>
          Design Refresh
        </title>

        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Auth0Provider
        domain={NEXT_PUBLIC_AUTH0_DOMAIN}
        clientId={NEXT_PUBLIC_AUTH0_CLIENT_ID}
        redirectUri={NEXT_PUBLIC_AUTH0_REDIRECT_URI}
        audience={NEXT_PUBLIC_AUTH0_AUDIENCE}
      >
        <div className={"md:flex md:flex-row"}>
          {/* Create a sticky sidebar: */}

          <aside className={"md:h-screen sticky top-0"}>
            <Sidebar />
          </aside>

          <div className={"flex-col w-full"}>
            <PersistGate loading={null} persistor={persistStore(store)}>
              <Component {...pageProps} />
            </PersistGate>
          </div>
        </div>
      </Auth0Provider>
    </>
  );
};

export default wrapper.withRedux(WrappedApp);
