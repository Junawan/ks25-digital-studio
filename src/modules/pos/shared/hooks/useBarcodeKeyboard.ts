"use client";

import {
  useCallback,
  useEffect,
  useRef,
} from "react";

interface Props {
  enabled?: boolean;

  minLength?: number;

  timeout?: number;

  onDetected: (barcode: string) => void;
}

export function useBarcodeKeyboard({
  enabled = true,
  minLength = 4,
  timeout = 100,
  onDetected,
}: Props) {
  const buffer =
  useRef("");

const timer =
  useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const clear = useCallback(() => {
    buffer.current = "";

    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
        clear();
        return;
    }

    function onKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.ctrlKey ||
        event.altKey ||
        event.metaKey
      ) {
        return;
      }

      if (event.key === "Enter") {
        const value =
          buffer.current.trim();

        if (
          value.length >= minLength
        ) {
          onDetected(value);
        }

        clear();

        return;
      }

      if (
        event.key.length === 1
      ) {
        buffer.current += event.key;

        if (timer.current) {
          clearTimeout(
            timer.current
          );
        }

        timer.current =
          setTimeout(() => {
            clear();
          }, timeout);
      }
    }

    window.addEventListener(
      "keydown",
      onKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        onKeyDown
      );

      clear();
    };
  }, [
    enabled,
    timeout,
    minLength,
    onDetected,
    clear,
  ]);
}