"use client";

import { createContext } from "react";

export interface PosContextValue {
  companyId: string;

  workstationId: string;
}

export const PosContext =
  createContext<PosContextValue | null>(
    null
  );