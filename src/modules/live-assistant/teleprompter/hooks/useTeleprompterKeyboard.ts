"use client";

import { useEffect } from "react";

interface Props {

  onPlayPause: () => void;

  onPrev: () => void;

  onNext: () => void;

  onFontUp: () => void;

  onFontDown: () => void;

}

export function useTeleprompterKeyboard({

  onPlayPause,

  onPrev,

  onNext,

  onFontUp,

  onFontDown,

}: Props) {

  useEffect(() => {

    function handleKeyDown(
      event: KeyboardEvent
    ) {

      switch (event.code) {

        case "Space":
case "Enter":
case "NumpadEnter":
case "MediaPlayPause":
case "KeyK":

  event.preventDefault();

  onPlayPause();

  break;

        case "ArrowLeft":
case "PageUp":
case "MediaTrackPrevious":

  event.preventDefault();

  onPrev();

  break;

        case "ArrowRight":
case "PageDown":
case "MediaTrackNext":

  event.preventDefault();

  onNext();

  break;

        case "Equal":
case "NumpadAdd":
case "ArrowUp":

  event.preventDefault();

  onFontUp();

  break;

        case "Minus":
case "NumpadSubtract":
case "ArrowDown":

  event.preventDefault();

  onFontDown();

  break;

      }

    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

  }, [

    onPlayPause,

    onPrev,

    onNext,

    onFontUp,

    onFontDown,

  ]);

}