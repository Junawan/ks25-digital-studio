"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/modules/invitation/theme/ThemeProvider";

export default function Countdown({
  targetDate,
}: {
  targetDate: string;
}) {

  const theme = useTheme();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  function CountdownBox({
  value,
  label,
}: {
  value: number;
  label: string;
}) {

  const theme = useTheme();

  return (

    <div
      className={`
      w-24
      h-24
      md:w-28
      md:h-28
      rounded-xl
      flex
      flex-col
      items-center
      justify-center
      ${theme.countdown.card}
      `}
    >

      <div
        className={`
        text-3xl
        md:text-4xl
        font-bold
        ${theme.countdown.number}
        `}
      >
        {String(value).padStart(2, "0")}
      </div>

      <div
        className={`
        text-xs
        uppercase
        tracking-[3px]
        mt-2
        ${theme.countdown.label}
        `}
      >
        {label}
      </div>

    </div>

  );
}

  useEffect(() => {

    const interval = setInterval(() => {

      const target =
        Date.parse(targetDate);

      const now =
        new Date().getTime();

      const diff =
        target - now;

      if (diff <= 0) {

        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      setTimeLeft({
        days: Math.floor(
          diff / (1000 * 60 * 60 * 24)
        ),

        hours: Math.floor(
          (diff / (1000 * 60 * 60)) % 24
        ),

        minutes: Math.floor(
          (diff / (1000 * 60)) % 60
        ),

        seconds: Math.floor(
          (diff / 1000) % 60
        ),
      });

    }, 1000);

    return () =>
      clearInterval(interval);

  }, [targetDate]);

  return (

    <section
      className="
      relative
      py-10
      overflow-hidden
      "
    >

      <div
        className="
        relative
        z-10
        max-w-5xl
        mx-auto
        px-6
        text-center
        "
      >

        <div
          className="
          relative
          w-40
          h-40
          mx-auto
          mb-6
          "
        >

          <img
            src={theme.countdown.frame}
            alt=""
            className="
            absolute
            inset-0
            w-full
            h-full
            object-contain
            "
          />

          <div
            className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            "
          >
            <span
              className={`
              text-4xl
              ${theme.countdown.heartColor}
              `}
            >
              ♡
            </span>
          </div>

        </div>

        <h2
          className={`
          text-4xl
          md:text-5xl
          ${theme.font.title}
          ${theme.text.primary}
          `}
        >
          {theme.countdown.title}
        </h2>

        <img
          src={theme.countdown.divider}
          alt=""
          className="
          w-56
          mx-auto
          mt-5
          mb-12
          opacity-90
          "
        />

        <div
          className="
          flex
          justify-center
          gap-4
          md:gap-6
          flex-wrap
          "
        >

          <CountdownBox
            value={timeLeft.days}
            label="Hari"
          />

          <CountdownBox
            value={timeLeft.hours}
            label="Jam"
          />

          <CountdownBox
            value={timeLeft.minutes}
            label="Menit"
          />

          <CountdownBox
            value={timeLeft.seconds}
            label="Detik"
          />

        </div>

        <img
          src={theme.countdown.divider}
          alt=""
          className="
          w-56
          mx-auto
          mt-12
          opacity-90
          "
        />

      </div>

    </section>

  );
}