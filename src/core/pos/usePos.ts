"use client";

import { useContext } from "react";

import { PosContext } from "./PosContext";

export function usePos() {
  const context =
    useContext(PosContext);

  if (!context) {
    throw new Error(
      "usePos harus digunakan di dalam PosProvider."
    );
  }

  return context;
}