"use client";

import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

let initialized = false;

function openRoute(route: string) {
  if (!route) return;

  window.location.href = route;
}

export async function initializeDeepLink() {
  if (initialized) {
    return;
  }

  initialized = true;

  if (!Capacitor.isNativePlatform()) {
    return;
  }

  // App dibuka dari shortcut/deeplink
  App.addListener("appUrlOpen", ({ url }) => {
    if (!url) return;

    const route = url
      .replace("ks25://", "/")
      .replace(
        "https://www.ks25studio.web.id",
        ""
      );

    openRoute(route);
  });

  // App dibuka ulang dari shortcut
  const launch = await App.getLaunchUrl();

  if (launch?.url) {
    const route = launch.url
      .replace("ks25://", "/")
      .replace(
        "https://www.ks25studio.web.id",
        ""
      );

    openRoute(route);
  }
}