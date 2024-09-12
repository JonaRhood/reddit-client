"use client";
import type { AppStore } from "@/app/lib/store";
import { makeStore } from "@/app/lib/store";
import { setupListeners } from "@reduxjs/toolkit/query";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { fetchToken } from "@/app/lib/features/artLibrary/fetchData";

interface Props {
  readonly children: ReactNode;
}

export const StoreProvider = ({ children }: Props) => {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (storeRef.current != null) {
      // configure listeners using the provided defaults
      // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
      const unsubscribe = setupListeners(storeRef.current.dispatch);
      return unsubscribe;
    }
  }, []);

  useEffect(() => {
    const lastTokenTime = localStorage.getItem("lastTokenTime");
    const currentTime = Date.now();

    if (!lastTokenTime || (currentTime - parseInt(lastTokenTime, 10)) > 86000000) {
      fetchToken();
    }

  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
};
