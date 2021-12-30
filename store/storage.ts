/**
 * Storage/persistence.
 */
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import {WebStorage} from "redux-persist/lib/types";

/**
 * Create a no-op storage.
 *
 * @returns {WebStorage} the storage container
 */
const createNoOpStorage = (): WebStorage => {
  return {
    getItem(_key: string) {
      return Promise.resolve("");
    },
    setItem(_key: unknown, value: never) {
      return Promise.resolve(value);
    },
    removeItem(_key: unknown) {
      return Promise.resolve();
    }
  };
};

const storage: WebStorage = (
  typeof window !== "undefined" ? createWebStorage("local") : createNoOpStorage()
);

export default storage;
