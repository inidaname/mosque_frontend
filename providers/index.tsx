"use client";

import React from "react";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// import en from "@/lang/en.json";
import { persiststore, store } from "@/store/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persiststore}>
        {children}
      </PersistGate>
    </Provider>
  );
}
