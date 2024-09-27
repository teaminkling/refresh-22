import "@fortawesome/fontawesome-svg-core/styles.css";
import type {AppProps} from "next/app";
import Head from "next/head";
import {FC} from "react";
import {useStore} from "react-redux";
import {Store} from "redux";
import {persistStore} from "redux-persist";
import {PersistGate} from "redux-persist/integration/react";
import Layout from "../components/layout";
import {wrapper} from "../store/store";
import "../styles/globals.css";

const WrappedApp: FC<AppProps> = ({Component, pageProps}: AppProps) => {
  const store: Store = useStore();

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
