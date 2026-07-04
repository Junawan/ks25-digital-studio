"use client";

import { useEffect, useRef } from "react";

interface Props {

  onPrev: () => void;

  onNext: () => void;

}

export function useTeleprompterSwipe({

  onPrev,

  onNext,

}: Props) {

  const startX = useRef(0);

  const startY = useRef(0);

  useEffect(() => {

    function touchStart(
      e: TouchEvent
    ) {

      const touch = e.touches[0];

      startX.current = touch.clientX;

      startY.current = touch.clientY;

    }

    function touchEnd(
      e: TouchEvent
    ) {

      const touch =
        e.changedTouches[0];

      const dx =
        touch.clientX -
        startX.current;

      const dy =
        touch.clientY -
        startY.current;

      if (
        Math.abs(dx) >
        Math.abs(dy)
      ) {

        if (dx > 80) {

          onPrev();

        }

        if (dx < -80) {

          onNext();

        }

      }

    }

    window.addEventListener(
      "touchstart",
      touchStart,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "touchend",
      touchEnd,
      {
        passive: true,
      }
    );

    return () => {

      window.removeEventListener(
        "touchstart",
        touchStart
      );

      window.removeEventListener(
        "touchend",
        touchEnd
      );

    };

  }, [

    onPrev,

    onNext,

  ]);

}