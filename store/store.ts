import {composeWithDevTools} from "@redux-devtools/extension";
import {createWrapper} from "next-redux-wrapper";
import {applyMiddleware, createStore, Reducer, Store} from "redux";
import {persistReducer} from "redux-persist";
import thunkMiddleware from "redux-thunk";
import reducers from "./reducers";
import storage from "./storage";

const _createStore = (reducer: Reducer): Store => {
  let middleware;

  if (process.env.NODE_ENV !== "production") {
    middleware = composeWithDevTools(applyMiddleware(thunkMiddleware));
  } else {
    middleware = applyMiddleware(thunkMiddleware);
  }

  return createStore(reducer, middleware);
};

const useStore = (): Store => {
  // There are two different types of reducer: a regular one (server) and one that persists to
  // storage. Determine which is needed as this code will run on both backend and frontend.

  let reducer: Reducer = reducers;
  if (typeof window !== "undefined") {
    reducer = persistReducer({
      key: "refresh-22", storage: storage, blacklist: [], timeout: 8,
    }, reducers);
  }

  return _createStore(reducer);
};

export const wrapper = createWrapper(useStore);
