"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { scannerDI }
from "../di/scanner";

interface Props {
  companyId: string;

  workstationId: string;
}

export function useScanner({
  companyId,
  workstationId,
}: Props) {
  const [waiting, setWaiting] =
    useState(false);

  const [barcode, setBarcode] =
    useState("");

  const unsubscribeRef =
    useRef<(() => void) | null>(
      null
    );

  const resolveRef =
    useRef<
      ((barcode: string) => void)
      | null
    >(null);

  const cancel = useCallback(() => {
    unsubscribeRef.current?.();

    unsubscribeRef.current = null;

    resolveRef.current = null;

    setWaiting(false);
  }, []);

  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  const waitForScan =
    useCallback(() => {

      setWaiting(true);

      return new Promise<string>(
        (resolve) => {

          resolveRef.current =
            resolve;

          unsubscribeRef.current =
            scannerDI
              .scannerService
              .waitForScan(
                companyId,
                workstationId,
                async (
                  session
                ) => {

                  if (
                    session.status !==
                    "scanned"
                  ) {
                    return;
                  }

                  setBarcode(
                    session.barcode
                  );

                  await scannerDI
                    .scannerService
                    .reset(
                      companyId,
                      workstationId
                    );

                  unsubscribeRef
                    .current?.();

                  unsubscribeRef.current =
                    null;

                  setWaiting(
                    false
                  );

                  resolve(
                    session.barcode
                  );
                }
              );
        }
      );
    }, [
      companyId,
      workstationId,
    ]);

  return {
    waiting,

    barcode,

    waitForScan,

    cancel,
  };
}