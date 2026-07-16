import type { ReactNode } from "react";

import PosProvider from "@/core/pos/PosProvider";
import PosBottomNavigation from "@/modules/pos/shared/components/PosBottomNavigation";

interface Props {
  children: ReactNode;
}

export default function Layout({
  children,
}: Props) {
  return (
    <PosProvider>
      {children}
      <PosBottomNavigation />
    </PosProvider>
  );
}