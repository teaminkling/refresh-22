/**
 * Reducer functions.
 *
 * A reducer is simply anything that takes a `state` and an `action` object, determines how to
 * update that state (if necessary), then returns the new state.
 *
 * In other words: `(state, action) => newState`.
 */

import {combineReducers} from "redux";
import {RootState} from "./state";

// Define all of the reducers in the app and then combine them. It is up to contributors to keep
// track of what the reducer names are as they map directly to the root state object.

export default combineReducers<RootState>({});
