"use client";

import { useState } from "react";
import { useTheme } from "@/modules/invitation/theme/ThemeProvider";

export default function LuxuryBlackRsvp({
  slug,
  demo = false,
}: {
  slug: string;
  demo?: boolean;
}) {

  const theme = useTheme();

  const [name, setName] =
    useState("");

  const [guestCount, setGuestCount] =
    useState(1);

  const [attendance, setAttendance] =
    useState("hadir");

    const [message, setMessage] =
  useState("");

  const handleSubmit = async () => {

  if (demo) return;

  try {

    const response = await fetch(`/api/undangan/${slug}/rsvp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, attendance, guestCount, message }) });
    if (!response.ok) throw new Error("RSVP gagal dikirim");

    alert(
      "Konfirmasi berhasil dikirim"
    );

    setName("");
    setMessage("");
    setGuestCount(1);

  } catch (error) {

    console.error(error);

    alert(
      "Gagal mengirim RSVP"
    );

  }
};

  return (
    <section className="relative py-10 overflow-hidden">

      <div className="max-w-xl mx-auto px-6 text-center">

        <div className="relative w-40 h-40 mx-auto mb-6">

          <img
            src={theme.rsvp.frame}
            alt=""
            className="absolute inset-0 w-full h-full object-contain"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <span
  className={`
  text-4xl
  ${theme.rsvp.iconColor}
  `}
>
  {theme.rsvp.icon}
</span>
          </div>

        </div>

        <h2
className={`
text-4xl
${theme.font.title}
${theme.text.primary}
`}
>
          Konfirmasi Kehadiran
        </h2>

        <img
          src={theme.rsvp.divider}
          alt=""
          className="w-56 mx-auto my-6"
        />

        {demo ? (
          <div className="rounded-2xl border border-current/20 p-5 text-sm">
            <p className="font-semibold">Contoh konfirmasi kehadiran</p>
            <p className="mt-2 opacity-80">Form RSVP akan aktif pada undangan yang Anda buat.</p>
            <button type="button" disabled className={`${theme.rsvp.button} mt-4 cursor-not-allowed opacity-60`}>Mode demo</button>
          </div>
        ) : <div className="space-y-4">

          <input
            type="text"
            placeholder="Nama"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className={theme.rsvp.input}
          />

          <input
            type="number"
            min={1}
            value={guestCount}
            onChange={(e) =>
              setGuestCount(
                Number(e.target.value)
              )
            }
            className={theme.rsvp.input}
          />

          <select
            value={attendance}
            onChange={(e) =>
              setAttendance(
                e.target.value
              )
            }
            className={theme.rsvp.input}
          >
            <option value="hadir">
              Hadir
            </option>

            <option value="tidak-hadir">
              Tidak Hadir
            </option>
          </select>

<p
  className={`
mt-2
text-sm
tracking-wide
${theme.rsvp.helperText}
`}
>
  Tinggalkan doa dan harapan terbaik untuk kedua mempelai
</p>

          <textarea
  placeholder="Tuliskan ucapan dan doa terbaik..."
  value={message}
  onChange={(e)=>setMessage(e.target.value)}
  className={theme.rsvp.textarea}
/>

          <button
            onClick={handleSubmit}
            className={theme.rsvp.button}
          >
            Kirim RSVP
          </button>

        </div>}

        <img
          src={theme.rsvp.divider}
          alt=""
          className="w-56 mx-auto mt-8"
        />

      </div>

    </section>
  );
}
