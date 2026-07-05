"use client";

import { useEffect } from "react";
import { App, BackButtonListenerEvent } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

export type AndroidBackHandler = (
  event: BackButtonListenerEvent
) => boolean | void;

export function useAndroidBack(handler: AndroidBackHandler) {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let listener: { remove: () => Promise<void> } | undefined;

    App.addListener("backButton", (event) => {
      handler(event);
    }).then((l) => {
      listener = l;
    });

    return () => {
      listener?.remove();
    };
  }, [handler]);
}