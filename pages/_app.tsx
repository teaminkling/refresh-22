import type {AppProps} from "next/app";
import {Provider} from "react-redux";
import Sidebar from "../components/sidebar";
import {useStore} from "../store/store";
import "../styles/globals.css";

/**
 * Main app component that provides access to the Redux store.
 *
 * @param Component the component
 * @param {any} pageProps the page props
 * @returns {JSX.Element} the {@link JSX.Element}
 * @constructor
 */
const App = ({Component, pageProps}: AppProps): JSX.Element => {
  const store = useStore(pageProps.initialReduxState);

  return (
    <Provider store={store}>
      <div className={"md:flex md:flex-row"}>
        {/* Create a sticky sidebar: */}

        <aside className={"md:h-screen sticky top-0"}>
          <Sidebar />
        </aside>

        <Component {...pageProps} />
      </div>
    </Provider>
  );
};

export default App;
