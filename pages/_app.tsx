import type {AppProps} from "next/app";
import {Provider} from "react-redux";
import {useStore} from "../store/store";
import "../styles/globals.css";

const App = ({Component, pageProps}: AppProps): JSX.Element => {
  const store = useStore(pageProps.initialReduxState);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
