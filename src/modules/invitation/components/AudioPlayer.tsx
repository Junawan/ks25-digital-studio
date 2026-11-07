"use client";

import {
  useEffect,
  useRef,
} from "react";

export default function AudioPlayer({
  isPlaying,
  musicUrl,
}: {
  isPlaying: boolean;
  musicUrl?: string;
}) {

  const audioRef =
    useRef<HTMLAudioElement>(null);

  useEffect(() => {

    const audio =
      audioRef.current;

    if (!audio)
      return;

    if (isPlaying) {

      audio.play().catch(
        console.log
      );

    } else {

      audio.pause();

    }

  }, [isPlaying]);

  if (!musicUrl)
    return null;

  return (

    <audio
      ref={audioRef}
      loop
      src={musicUrl}
    />

  );
}