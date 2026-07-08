"use client";

import { useEffect } from "react";

import { initializeDeepLink } from "@/lib/native/deepLink";

export default function DeepLinkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initializeDeepLink();
  }, []);

  return <>{children}</>;
}