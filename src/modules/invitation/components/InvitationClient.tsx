"use client";

import useInvitation from "@/modules/invitation/hooks/useInvitation";

import Events from "@/modules/invitation/components/sections/Events";

import Hero
from "@/modules/invitation/components/sections/Hero";

import Opening
from "@/modules/invitation/components/sections/Opening";

import Couple
from "@/modules/invitation/components/sections/Couple";

import InvitationWrapper
from "./sections/InvitationWrapper";

import { useEffect } from "react";

import Countdown
from "@/modules/invitation/components/sections/Countdown";

import Rsvp
from "@/modules/invitation/components/sections/Rsvp";

import Location
from "@/modules/invitation/components/sections/Location";

import LoveStory
from "@/modules/invitation/components/sections/LoveStory";

import Gallery
from "@/modules/invitation/components/sections/Gallery";

import Wishes
from "@/modules/invitation/components/sections/Wishes";

import Gift
from "@/modules/invitation/components/sections/Gift";

import { ThemeProvider } from "@/modules/invitation/theme/ThemeProvider";

import ThemeLayout
from "@/modules/invitation/components/common/ThemeLayout";

import Reveal
from "@/modules/invitation/components/common/Reveal";
import type { DemoInvitation } from "@/modules/invitation/data/demoInvitations";

export default function InvitationClient({
  slug,
  guestName,
  demoData,
}: {
  slug: string;
  guestName?: string;
  demoData?: DemoInvitation;
}) {
  const {
    data: invitation,
    loading: invitationLoading,
  } = useInvitation(slug, !demoData);
  const data = demoData ?? invitation;
  const loading = demoData ? false : invitationLoading;

  useEffect(() => {
  if (demoData) return;
  if (new URLSearchParams(window.location.search).get("preview") === "1") return;

  const key =
    `viewed-${slug}`;

  const viewed =
    localStorage.getItem(
      key
    );

  if (viewed)
    return;

  const addView =
    async () => {

      await fetch(`/api/undangan/${slug}/view`, { method: "POST" });

      localStorage.setItem(
        key,
        "true"
      );
    };

  addView();

}, [slug, demoData]);

  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10">
        Undangan tidak ditemukan
      </div>
    );
  }

  return (
  <ThemeProvider theme={data.theme}>

    <InvitationWrapper
  groom={data.groom}
  bride={data.bride}
  guestName={guestName || ""}
  coverImage={data.coverImage}
  musicUrl={data.musicUrl}
>

    <ThemeLayout>

      <main>

  <>
    <Hero
groom={data.groom}
bride={data.bride}
coverImage={data.coverImage}
/>

<Reveal>

    <Opening
  invitation={data}
/>

</Reveal>

<Reveal delay={0.1}>

    <Couple data={data} />

</Reveal>

<Reveal delay={0.15}>

<LoveStory stories={data.loveStory}
/>

</Reveal>

     <Reveal delay={0.2}>

    <Events data={data}/>

</Reveal>

<Reveal direction="scale">

    <Gallery
  gallery={data.gallery}
/>

</Reveal>

<Reveal>

    <Countdown
  targetDate={data.date}
/>

</Reveal>
<Rsvp slug={slug} demo={Boolean(demoData)} />

<Wishes
    slug={slug}
    demoMessages={demoData?.demoMessages}
/>

<Location
  mapsUrl={data.mapsUrl}
  akadPlace={data.akadPlace}
  resepsiPlace={data.resepsiPlace}
/>

<Reveal direction="up">

    <Gift
    data={data}
    demo={Boolean(demoData)}
/>

</Reveal>
  </>

    </main>
    </ThemeLayout>

    </InvitationWrapper>

</ThemeProvider>
  );
}
