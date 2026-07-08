"use client";

import { useEffect, useRef } from "react";

import { useRouter } from "next/navigation";

import {
  getLaunchRoute,
  subscribeDeepLink,
} from "@/lib/native/deepLink";

export default function DeepLinkProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  const handledLaunch =
    useRef(false);

  useEffect(() => {

    let mounted = true;

    getLaunchRoute()
      .then((route) => {

        if (
          !mounted ||
          handledLaunch.current ||
          !route
        ) {
          return;
        }

        handledLaunch.current =
          true;

        router.replace(route);

      });

    const listener =
      subscribeDeepLink(
        (route) => {

          router.replace(route);

        }
      );

    return () => {

      mounted = false;

      listener.then(
        (handle) =>
          handle.remove()
      );

    };

  }, [router]);

  return <>{children}</>;

}