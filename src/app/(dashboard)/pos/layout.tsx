import type { ReactNode } from "react";

import PosProvider from "@/core/pos/PosProvider";

interface Props {
  children: ReactNode;
}

export default function Layout({
  children,
}: Props) {
  return (
    <PosProvider>
      {children}
    </PosProvider>
  );
}