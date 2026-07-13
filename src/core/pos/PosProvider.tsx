"use client";

import {
  ReactNode,
  useMemo,
} from "react";

import { useWorkspace }
from "@/core/workspace/WorkspaceProvider";

import { PosContext }
from "./PosContext";

interface Props {
  children: ReactNode;
}

export default function PosProvider({
  children,
}: Props) {
  const { workspace } =
    useWorkspace();

  const companyId =
    workspace?.company.id ?? "";

  // sementara hardcode
  // nanti diganti WorkstationService
  const workstationId =
    "kasir-1";

  const value = useMemo(
    () => ({
      companyId,
      workstationId,
    }),
    [
      companyId,
      workstationId,
    ]
  );

  return (
    <PosContext.Provider value={value}>
      {children}
    </PosContext.Provider>
  );
}