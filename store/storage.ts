import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import {WebStorage} from "redux-persist/lib/types";

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
