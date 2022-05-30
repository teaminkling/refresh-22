/**
 * Functions related to creating the Redux store instance.
 *
 * This file will not need to be edited frequently, if at all.
 */

import {composeWithDevTools} from "@redux-devtools/extension";
import {createWrapper} from "next-redux-wrapper";
import {applyMiddleware, createStore, Reducer, Store} from "redux";
import {persistReducer} from "redux-persist";
import thunkMiddleware from "redux-thunk";
import reducers from "./reducers";
import storage from "./storage";

/**
 * Initialize the Redux store given all of the reducers defined externally.
 *
 * @param {Reducer} reducer the reducer
 * @returns {Store} the Redux Store with Thunk middleware enabled
 */
const _createStore = (reducer: Reducer): Store => {
  let middleware;

  if (process.env.NODE_ENV !== "production") {
    middleware = composeWithDevTools(applyMiddleware(thunkMiddleware));
  } else {
    middleware = applyMiddleware(thunkMiddleware);
  }

  return createStore(reducer, middleware);
};

/**
 * Given a page with initial Redux state, on navigation, merge with current store state.
 *
 * @returns a {@link Store}
 */
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
