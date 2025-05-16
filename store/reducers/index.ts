/* eslint-disable @typescript-eslint/no-unused-vars */
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import { apiSlice } from "@/service/apiSlice";

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

export const allReducers = {};

const persistConfig = {
  key: "root",
  storage,
  blacklist: [apiSlice.reducerPath],
};

export const rootReducers = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  ...allReducers,
});

export default persistReducer(persistConfig, rootReducers);
