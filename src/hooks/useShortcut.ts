"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Capacitor } from "@capacitor/core";

import {
  Shortcut,
} from "@/lib/native/shortcut";

function sleep(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

export function useShortcut(
  id: string
) {
  const [loading, setLoading] =
    useState(true);

  const [pinning, setPinning] =
    useState(false);

  const [pinned, setPinned] =
    useState(false);

  const refresh =
    useCallback(async () => {

      if (
        !Capacitor.isNativePlatform()
      ) {

        setPinned(false);

        setLoading(false);

        return;

      }

      try {

        const result =
          await Shortcut.isPinned({
            id,
          });

        setPinned(
          result.pinned
        );

      } finally {

        setLoading(false);

      }

    }, [id]);

  useEffect(() => {

    refresh();

  }, [refresh]);

  async function pin(
    title: string,
    route: string,
    icon: string
  ) {

    setPinning(true);

    try {

      const result =
        await Shortcut.pin({

          id,

          title,

          route,

          icon,

        });

      if (!result.success) {

        return false;

      }

      // Tunggu Android selesai membuat shortcut
      for (
        let i = 0;
        i < 10;
        i++
      ) {

        const check =
          await Shortcut.isPinned({
            id,
          });

        if (
          check.pinned
        ) {

          setPinned(true);

          return true;

        }

        await sleep(300);

      }

      return false;

    } finally {

      setPinning(false);

    }

  }

  return {

    loading,

    pinning,

    pinned,

    refresh,

    pin,

  };

}