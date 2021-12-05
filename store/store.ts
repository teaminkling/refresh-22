/**
 * Functions related to creating the Redux store instance.
 *
 * This file will not need to be edited frequently, if at all.
 */

import {useMemo} from "react";
import {applyMiddleware, createStore, Store} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import reducers from "./reducers";

let store: Store | undefined;

/**
 * Initialize the Redux store given all of the reducers defined externally.
 *
 * @param initialState the initial state
 * @returns the Redux Store with Thunk middleware enabled
 */
const _createStore = (initialState: Record<string, unknown>): Store => createStore(
  reducers, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)),
);

/**
 * Given a page with initial Redux state, on navigation, merge with current store state.
 *
 * @param preloadedState the preloaded state
 * @returns a {@link Store}
 */
const _useStore = (preloadedState: Record<string, unknown>): Store => {
  let _store: Store = store ?? _createStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state with the current
  // state in the store, and create a new store.

  if (preloadedState && store) {
    _store = _createStore({...store.getState(), ...preloadedState});

    // Reset the current store while we are setting the new store.

    store = undefined;
  }

  // For SSG and SSR always create a new store.

  if (typeof window === "undefined") {
    return _store;
  }

  if (!store) {
    store = _store;
  }

  return _store;
};

/**
 * Use a store using a memoizer.
 *
 * @param initialState the initial state
 * @returns the {@link Store}
 */
export const useStore = (initialState: Record<string, unknown>): Store => useMemo(
  () => _useStore(initialState), [initialState]
);
