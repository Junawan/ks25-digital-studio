"use client";

import { ReactNode, useEffect, useState } from "react";

import MobileShell from "../mobile/MobileShell";

interface Props {
  children: ReactNode;
}

export default function AppLayout({
  children,
}: Props) {
  const [mobile, setMobile] =
    useState(false);

  useEffect(() => {
    function check() {
      setMobile(window.innerWidth < 768);
    }

    check();

    window.addEventListener(
      "resize",
      check
    );

    return () =>
      window.removeEventListener(
        "resize",
        check
      );
  }, []);

  if (mobile) {
    return (
      <MobileShell>
        {children}
      </MobileShell>
    );
  }

  return <>{children}</>;
}