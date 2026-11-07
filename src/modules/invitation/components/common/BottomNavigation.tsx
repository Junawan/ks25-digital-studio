"use client";

import { CalendarDays, Gift, Heart, House, Image, MapPin, Music2 } from "lucide-react";
import { navigation } from "@/modules/invitation/config/navigation";
import { useTheme } from "@/modules/invitation/theme/ThemeProvider";

type BottomNavigationProps = {
  isPlaying: boolean;
  onToggleMusic: () => void;
};

export default function BottomNavigation({
  isPlaying,
  onToggleMusic,
}: BottomNavigationProps) {

  const theme = useTheme();

  const scrollTo = (id: string) => {

    document
      .getElementById(id)
      ?.scrollIntoView({

        behavior: "smooth",

        block: "start",

      });

  };

  return (

    <div
      className="
      fixed
      bottom-6
      left-1/2
      -translate-x-1/2
      z-50
      "
    >

      <div
        className={`
        flex
        items-center
        gap-2
        rounded-full
        px-3
        py-2
        backdrop-blur-xl
        border
        ${theme.bottomNav.background}
        ${theme.bottomNav.border}
        ${theme.bottomNav.shadow}
        `}
      >

        {navigation.map((item) => {
          const icons = { hero: House, couple: Heart, events: CalendarDays, gallery: Image, gift: Gift, location: MapPin };
          const SectionIcon = icons[item.id as keyof typeof icons] ?? House;
          return (

  <button

    key={item.id}

    onClick={() => scrollTo(item.id)}

    className="
    w-11
    h-11
    rounded-full
    flex
    items-center
    justify-center
    transition
    duration-300
    "

  >

    <SectionIcon size={22} className={theme.bottomNav.icon} />

  </button>

)}
)}

{/* Music */}
<button

  onClick={onToggleMusic}

  className="
  w-11
  h-11
  rounded-full
  flex
  items-center
  justify-center
  transition
  duration-300
  "

>

  <Music2 size={22} className={theme.bottomNav.icon} />

</button>

      </div>

    </div>

  );

}
