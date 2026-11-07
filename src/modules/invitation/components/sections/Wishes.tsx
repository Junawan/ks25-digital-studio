"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/modules/invitation/theme/ThemeProvider";

export default function LuxuryBlackWishes({
  slug,
}: {
  slug: string;
}) {

  const theme = useTheme();

  const [messages, setMessages] =
    useState<any[]>([]);

  useEffect(() => {

    const load = async () => {

      const response = await fetch(`/api/undangan/${slug}/rsvp`, { cache: "no-store" });
      if (response.ok) setMessages(await response.json());
    };

    load();

  }, [slug]);

  return (
    <section className="py-12">

      <div className="max-w-3xl mx-auto px-6">

        <h2
className={`
text-center
text-4xl
${theme.font.title}
${theme.text.primary}
`}
>
  {theme.wishes.title}
</h2>

        <img
          src={theme.wishes.divider}
          alt=""
          className="w-56 mx-auto my-6"
        />

        <div className="space-y-4">

          {messages.map((item) => (

            <div
              key={item.id}
              className={theme.wishes.card}
            >

              <h3 className={`
${theme.font.title}
${theme.wishes.name}
`}>
                {item.name}
              </h3>

              <p className={`
mt-2
${theme.font.body}
${theme.wishes.message}
`}>
                {item.message}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
