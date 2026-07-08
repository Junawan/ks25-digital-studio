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

export function useShortcut(
  id: string
) {

  const [loading, setLoading] =
    useState(true);

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

    const result =
      await Shortcut.pin({

        id,

        title,

        route,

        icon,

      });

    if (
      result.success
    ) {

      await refresh();

    }

    return result.success;

  }

  return {

    loading,

    pinned,

    pin,

    refresh,

  };

}