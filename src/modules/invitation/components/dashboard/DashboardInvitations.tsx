"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/modules/invitation/lib/firebase";
import { useAuth } from "@/modules/invitation/providers/AuthProvider";

type Invitation = {
  slug: string;

  groom: string;

  bride: string;

  theme: string;

  date: string;

  status: "draft" | "active" | "expired";

  eventDate: string;

  activatedAt?: any;

  expiredAt?: any;
};

export default function DashboardInvitations() {

  const { user } = useAuth();

  const [items, setItems] =
    useState<Invitation[]>([]);

  const [loading, setLoading] =
    useState(true);

    const getProgress = (item: any) => {

  let total = 0;
  let filled = 0;

  const fields = [
    item.groom,
    item.bride,
    item.coverImage,
    item.groomImage,
    item.brideImage,
    item.mapsUrl,
    item.bankName,
    item.accountNumber,
    item.musicUrl,
    item.gallery?.length,
  ];

  total = fields.length;

  fields.forEach((field) => {

    if (
      field &&
      field !== "" &&
      field !== 0
    ) {
      filled++;
    }

  });

  return Math.round(
    (filled / total) * 100
  );

};

    const activateInvitation = async (
  item: Invitation
) => {

  if (
    !confirm(
      "Setelah diaktifkan, nama mempelai dan tanggal acara akan dikunci. Lanjutkan?"
    )
  ) {
    return;
  }

  const event = new Date(item.eventDate);

  const expired = new Date(event);

  expired.setDate(
    expired.getDate() + 30
  );

  await updateDoc(
    doc(
      db,
      "invitations",
      item.slug
    ),
    {

      status: "active",

      activatedAt:
        serverTimestamp(),

      expiredAt:
        expired,

    }
  );

  window.location.reload();

};

    const copyLink = (
  slug: string
) => {

  const url =
    `${window.location.origin}/undangan/${slug}`;

  navigator.clipboard.writeText(
    url
  );

  alert(
    "Link berhasil disalin"
  );
};

const copyGuestLink = (
  slug: string
) => {

  const guestName =
    prompt(
      "Masukkan nama tamu"
    );

  if (!guestName)
    return;

  const url =
`${window.location.origin}/undangan/${slug}?to=${encodeURIComponent(
  guestName
)}`;

  navigator.clipboard.writeText(
    url
  );

  alert(
    "Link tamu berhasil disalin"
  );
};

    const shareWhatsapp = (
  slug: string
) => {

  console.log("WA CLICK");
  const guestName =
    prompt(
      "Masukkan nama tamu"
    );

  if (!guestName)
    return;

  const invitationUrl =
`${window.location.origin}/undangan/${slug}?to=${encodeURIComponent(
  guestName
)}`;

  const message =
`Assalamu'alaikum Wr. Wb.

Kepada Yth.
${guestName}

Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara pernikahan kami.

Silakan buka undangan melalui link berikut:

${invitationUrl}

Terima kasih.`;

  const whatsappUrl =
`https://wa.me/?text=${encodeURIComponent(
  message
)}`;

window.location.href =
  whatsappUrl;

console.log(
  whatsappUrl
);

  window.open(
    whatsappUrl,
    "_blank"
  );
};

  useEffect(() => {

    if (!user) return;

    const load = async () => {

      const q = query(
  collection(db, "invitations"),
  where("ownerUid", "==", user.uid)
);

      const snapshot =
        await getDocs(q);

      const data =
        snapshot.docs.map((doc) => ({

          slug: doc.id,

          ...(doc.data() as Omit<
            Invitation,
            "slug"
          >),

        }));

      setItems(data);

      setLoading(false);

    };

    load();

  }, [user]);

  return (

    <div className="mt-10">

      <div
        className="
        flex
        justify-between
        items-center
        mb-8
        "
      >

        <h2
          className="
          text-3xl
          font-semibold
          "
        >
          Undangan Saya
        </h2>

        {items.length === 0 && (

  <Link
    href="/dashboard/create"
    className="
    px-5
    py-3
    rounded-xl
    bg-black
    text-white
    "
  >
    + Buat Undangan
  </Link>

)}

      </div>

      {loading ? (

        <div
          className="
          bg-white
          rounded-3xl
          p-10
          text-center
          "
        >
          Loading...
        </div>

      ) : items.length === 0 ? (

        <div
          className="
          bg-white
          rounded-3xl
          p-10
          text-center
          "
        >
          Belum ada undangan.
        </div>

      ) : (

        <div className="space-y-5">

          {items.map((item) => {

            const progress =
    getProgress(item);

  return (

            <div
              key={item.slug}
              className="
              bg-white
              rounded-3xl
              p-6
              shadow
              "
            >

              <h3
                className="
                text-2xl
                font-bold
                "
              >
                {item.groom} & {item.bride}
              </h3>

              <div
className="
flex
items-center
gap-3
mt-3
"
>

  <div className="mt-4">

  <div
    className="
    flex
    justify-between
    text-sm
    mb-2
    "
  >

    <span>Kelengkapan</span>

    <span>
      {progress}%
    </span>

  </div>

  <div
    className="
    w-full
    h-3
    bg-zinc-200
    rounded-full
    overflow-hidden
    "
  >

    <div
      className="
      h-full
      bg-emerald-500
      "
      style={{
        width: `${progress}%`,
      }}
    />

  </div>

</div>

{item.status === "draft" && (

<span
className="
px-3
py-1
rounded-full
bg-yellow-100
text-yellow-700
text-sm
font-medium
"
>

🟡 Draft

</span>

)}

{item.status === "active" && (

<span
className="
px-3
py-1
rounded-full
bg-green-100
text-green-700
text-sm
font-medium
"
>

🟢 Aktif

</span>


)}

{progress < 90 && (

<p
className="
text-sm
text-red-500
mt-2
"
>

Lengkapi minimal
90%
sebelum
mengaktifkan undangan.

</p>

)}

{item.status === "expired" && (

<span
className="
px-3
py-1
rounded-full
bg-red-100
text-red-700
text-sm
font-medium
"
>

🔴 Expired

</span>

)}

</div>

              <p className="text-zinc-500 mt-2">
                Tema : {item.theme}
              </p>

              <p className="text-zinc-500">
                {item.date}
              </p>

              {item.status === "draft" && (

<button

disabled={progress < 90}

onClick={() =>
  activateInvitation(item)
}

className={`
px-4
py-2
rounded-lg
text-white

${
progress >= 90

?

"bg-amber-500"

:

"bg-zinc-300 cursor-not-allowed"

}

`}

>

Aktifkan

</button>


)}
<p
className="
text-sm
text-red-500
mt-2
"
>

Pastikan semua data sudah sesuai! 
Setelah diaktifkan, data mempelai, 
parent & tanggal tidak dapat diubah

</p>

              <div
                className="
                flex
                gap-3
                mt-6
                "
              >

                <Link
                  href={`/undangan/${item.slug}?preview=1`}
                  className="
                  px-4
                  py-2
                  rounded-lg
                  border
                  "
                >
                  Preview
                </Link>

                <Link
                  href={`/invitation/${item.slug}/edit`}
                  className="
                  px-4
                  py-2
                  rounded-lg
                  bg-black
                  text-white
                  "
                >
                  Edit
                </Link>

                <Link
                      href={`/invitation/${item.slug}`}
                      className="
                      px-4 py-2
                      rounded-xl
                      bg-[#9A7B45]
                      text-white
                      "
                    >
                      Data
                    </Link>
                
                    <button
                  onClick={() =>
                    copyLink(item.slug)
                  }
                  className="
                  px-4 py-2
                  rounded-xl
                  border
                  "
                >
                  Copy Link
                </button>
                
                <button
                  onClick={() =>
                    copyGuestLink(item.slug)
                  }
                  className="
                  px-4 py-2
                  rounded-xl
                  bg-green-500
                  text-white
                  "
                >
                  Copy Link + Nama
                </button>
                
                <button
                  onClick={() =>
                    shareWhatsapp(
                      item.slug
                    )
                  }
                  className="
                  px-4 py-2
                  rounded-xl
                  bg-green-600
                  text-white
                  "
                >
                  WhatsApp
                </button>

              </div>

            </div>
  );

})}

        </div>

      )}

    </div>

  );

}
