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
  useState(["elegant-gold", "modern-editorial", "aurora-nocturne"].includes(initialTheme) ? initialTheme : "luxury-black");

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

  if (!groom.trim() || !bride.trim() || !date) {
    alert("Lengkapi nama kedua mempelai dan tanggal acara terlebih dahulu.");
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
    <div className="mx-auto max-w-2xl rounded-3xl bg-white p-5 shadow sm:p-8">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#9A7B45]">Langkah 1 dari 2</p>
      <h1 className="text-3xl font-bold">Mulai buat undangan</h1>
      <p className="mb-7 mt-2 text-sm text-zinc-600">Isi informasi dasar dulu. Setelah ini, Anda bisa melengkapi foto, lokasi, cerita, dan detail acara.</p>

      <section className="mb-6 rounded-2xl border border-zinc-200 p-4 sm:p-5">
        <h2 className="text-lg font-semibold">Pilih tampilan undangan</h2>
        <p className="mb-3 mt-1 text-sm text-zinc-500">Tema masih bisa diganti nanti.</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[{id:"luxury-black", title:"Luxury Black", desc:"Elegan dengan nuansa gelap"}, {id:"elegant-gold", title:"Elegant Gold", desc:"Hangat dengan aksen keemasan"}, {id:"modern-editorial", title:"Modern Editorial", desc:"Sage lembut dengan sentuhan terracotta"}, {id:"aurora-nocturne", title:"Aurora Nocturne", desc:"Midnight teal, plum, dan coral dengan efek aurora"}].map((option) => (
            <button key={option.id} type="button" onClick={() => setTheme(option.id)} className={`rounded-xl border p-4 text-left transition ${theme === option.id ? "border-[#9A7B45] bg-amber-50 ring-2 ring-[#9A7B45]/30" : "border-zinc-200 hover:border-zinc-400"}`} aria-pressed={theme === option.id}>
              <span className="block font-semibold">{option.title}</span><span className="mt-1 block text-sm text-zinc-500">{option.desc}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-zinc-200 p-4 sm:p-5">
        <h2 className="text-lg font-semibold">Informasi dasar</h2>

        <input
          type="text"
          placeholder="Nama lengkap mempelai pria"
          value={groom}
          onChange={(e) =>
            setGroom(
              toTitleCase(e.target.value))
          }
          className="w-full border p-4 rounded-xl"
          aria-label="Nama mempelai pria"
        />

        <input
          type="text"
          placeholder="Nama lengkap mempelai wanita"
          value={bride}
          onChange={(e) =>
            setBride(
              toTitleCase(e.target.value))
          }
          className="w-full border p-4 rounded-xl"
          aria-label="Nama mempelai wanita"
        />

        <label className="block text-sm font-medium text-zinc-700" htmlFor="invitation-date">Tanggal dan waktu acara utama</label>

        <input
          id="invitation-date"
          type="datetime-local"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
          className="w-full rounded-xl border border-zinc-300 p-4 focus:border-[#9A7B45] focus:outline-none focus:ring-2 focus:ring-[#9A7B45]/20"
        />
        <p className="text-xs text-zinc-500">Tanggal ini digunakan sebagai hitung mundur di undangan.</p>

        <button
  type="button"
  onClick={createInvitation}
  className="w-full rounded-xl bg-[#9A7B45] px-6 py-4 font-semibold text-white transition hover:bg-[#876c3d] sm:w-auto"
>
  Lanjutkan & lengkapi undangan
</button>

      </section>

    </div>
  );
}
