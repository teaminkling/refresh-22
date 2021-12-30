import {Auth0Provider} from "@auth0/auth0-react";
import type {AppProps} from "next/app";
import {FC} from "react";
import {useStore} from "react-redux";
import {Store} from "redux";
import {persistStore} from "redux-persist";
import {PersistGate} from "redux-persist/integration/react";
import Sidebar from "../components/sidebar";
import {wrapper} from "../store/store";
import "../styles/globals.css";

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
    <Auth0Provider
      domain={"refresh.au.auth0.com"}
      clientId={"kuTjew7XeDDUVZ2k0QlrhFxwuDV8aaGc"}
      redirectUri={"http://localhost:3000"}
      audience={"https://refresh.fiveclawd.com/api/"}
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
  );
};

export default wrapper.withRedux(WrappedApp);
