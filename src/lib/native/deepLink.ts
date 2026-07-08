"use client";

import { App } from "@capacitor/app";

export function normalizeDeepLink(
  url: string
) {
  return url
    .replace(
      "ks25://",
      "/"
    )
    .replace(
      "https://www.ks25studio.web.id",
      ""
    );
}

export function subscribeDeepLink(
  callback: (
    route: string
  ) => void
) {

  const listener =
    App.addListener(
      "appUrlOpen",
      ({ url }) => {

        if (!url) {
          return;
        }

        callback(
          normalizeDeepLink(
            url
          )
        );

      }
    );

  return listener;

}

export async function getLaunchRoute() {

  const launch =
    await App.getLaunchUrl();

  if (!launch?.url) {
    return null;
  }

  return normalizeDeepLink(
    launch.url
  );

}