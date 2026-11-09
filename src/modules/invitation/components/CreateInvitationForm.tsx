"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/modules/invitation/lib/firebase";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/modules/invitation/providers/AuthProvider";

import { auth } from "@/modules/invitation/lib/firebase";

export default function CreateInvitationForm({ initialTheme = "luxury-black" }: { initialTheme?: string }) {

    const router = useRouter();
    const { user, profile } = useAuth();

  const [groom, setGroom] =
    useState("");

  const [bride, setBride] =
    useState("");

  const [date, setDate] =
    useState("");

    const [theme, setTheme] =
  useState(initialTheme === "elegant-gold" ? "elegant-gold" : "luxury-black");

  const loveStory = [
    {
      year: "",
      title: "",
      description: "",
    },
  ];

  function toTitleCase(text: string) {

  return text
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );

}

    const createInvitation = async () => {

  if (!user || !profile) {
    alert("Silakan login terlebih dahulu.");
    return;
  }

  const slug =
    `${groom}-${bride}-${Date.now()}`
      .toLowerCase()
      .replaceAll(" ", "-");

  await setDoc(
  doc(
    db,
    "invitations",
    slug
  ),
  {
    groom,
    bride,

    date,

    // tanggal acara
    eventDate: date,
    theme,

    loveStory,

    // status undangan
    status: "draft",

    // akan diisi nanti
    activatedAt: null,

    firstVisitorAt: null,

    expiredAt: null,

    // pemilik undangan
    ownerUid: auth.currentUser?.uid,

    ownerEmail: auth.currentUser?.email,
    companyId: profile.companyId,

    createdAt: serverTimestamp(),

    updatedAt: serverTimestamp(),
  }
);

  router.push(`/invitation/${slug}/edit`);

};

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow">

      <select
  value={theme}
  onChange={(e) =>
    setTheme(e.target.value)
  }
  className="
  w-full
  border
  p-4
  rounded-xl
  "
>

  <option value="luxury-black">
    Luxury Black
  </option>

  <option value="elegant-gold">
    Elegant Gold
  </option>

</select>

      <h1 className="text-4xl font-bold mb-8">
        Buat Undangan
      </h1>

      <div className="space-y-4">

        <input
          type="text"
          placeholder="Nama Pria"
          value={groom}
          onChange={(e) =>
            setGroom(
              toTitleCase(e.target.value))
          }
          className="w-full border p-4 rounded-xl"
        />

        <input
          type="text"
          placeholder="Nama Wanita"
          value={bride}
          onChange={(e) =>
            setBride(
              toTitleCase(e.target.value))
          }
          className="w-full border p-4 rounded-xl"
        />

        <input
          type="datetime-local"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
          className="w-full border p-4 rounded-xl"
        />

        <button
  onClick={createInvitation}
  className="bg-[#9A7B45] text-white px-6 py-4 rounded-xl"
>
  Buat Undangan & Lengkapi Data
</button>

      </div>

    </div>
  );
}
