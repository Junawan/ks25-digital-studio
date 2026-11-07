"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  db,
} from "@/modules/invitation/lib/firebase";

import ImageUpload
from "@/modules/invitation/components/ImageUpload";

import GalleryUpload
from "@/modules/invitation/components/GalleryUpload";

import MusicUpload
from "@/modules/invitation/components/MusicUpload";

import { useAuth } from "@/modules/invitation/providers/AuthProvider";
import { useRouter } from "next/navigation";
import {
  invitationThemes,
} from "@/modules/invitation/data/invitationThemes";

import OpeningTemplateModal
from "@/modules/invitation/components/modals/OpeningTemplateModal";
import ThemePickerModal
from "@/modules/invitation/components/modals/ThemePickerModal";

import { themes } from "@/modules/invitation/theme/themeConfig";

export default function EditInvitationForm({
  slug,
}: {
  slug: string;
}) {

  const { user, profile } = useAuth();

const router = useRouter();

  const [loading, setLoading] =
    useState(true);

    const [ownerUid, setOwnerUid] =
  useState("");

  const [groom, setGroom] =
    useState("");

  const [bride, setBride] =
    useState("");

  const [date, setDate] =
    useState("");

    const [akadDate, setAkadDate] =
  useState("");

const [akadTime, setAkadTime] =
  useState("");

const [akadPlace, setAkadPlace] =
  useState("");

const [resepsiDate, setResepsiDate] =
  useState("");

const [resepsiTime, setResepsiTime] =
  useState("");

const [resepsiPlace, setResepsiPlace] =
  useState("");

    const [coverImage,
  setCoverImage] =
  useState("");

const [groomImage,
  setGroomImage] =
  useState("");

const [brideImage,
  setBrideImage] =
  useState("");

  const [gallery,
  setGallery] =
  useState<string[]>([]);

const [qrisImage,
  setQrisImage] =
  useState("");

  const [mapsUrl, setMapsUrl] =
  useState("");

const [bankName, setBankName] =
  useState("");

const [accountNumber,
  setAccountNumber] =
  useState("");

const [accountName,
  setAccountName] =
  useState("");

  const [theme, setTheme] =
  useState("elegant-gold");

  const [groomParents,
  setGroomParents] =
  useState("");

const [brideParents,
  setBrideParents] =
  useState("");

  const [groomTitle, setGroomTitle] =
  useState("");

const [groomFather, setGroomFather] =
  useState("");

const [groomMother, setGroomMother] =
  useState("");

const [brideTitle, setBrideTitle] =
  useState("");

const [brideFather, setBrideFather] =
  useState("");

const [brideMother, setBrideMother] =
  useState("");

  const [musicUrl, setMusicUrl] =
  useState("");

  const [openingHeading, setOpeningHeading] =
  useState("");

const [openingContent, setOpeningContent] =
  useState("");

  const [openOpeningModal, setOpenOpeningModal] =
  useState(false);

  const [loveStory, setLoveStory] =
  useState<any[]>([]);

  const [openThemeModal, setOpenThemeModal] =
  useState(false);

  const currentTheme =

invitationThemes.find(

(item)=>

item.id===theme

);

  function toTitleCase(text: string) {

  return text
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );

}

function sentenceCase(text: string) {

  return text

    .toLowerCase()

    .replace(

      /(^\s*\w|[.!?]\s+\w)/g,

      (char)=>

      char.toUpperCase()

    );

}

const useDefaultOpening = () => {

  const currentTheme =
    themes[
      theme as keyof typeof themes
    ];

  if (!currentTheme) return;

  setOpeningHeading(
    currentTheme.opening.heading
  );

  setOpeningContent(
    currentTheme.opening.content
  );

};


  useEffect(() => {

    const load =
      async () => {

        const snap =
          await getDoc(
            doc(
              db,
              "invitations",
              slug
            )
          );

        if (
          snap.exists()
        ) {

          const data =
            snap.data();

            setOwnerUid(
  data.ownerUid || ""
);

            if (

profile?.role !== "admin" &&

data.ownerUid !== user?.uid

) {

alert(
  "Anda tidak memiliki akses."
);

          router.replace("/invitation");

return;

}

          setGroom(
            data.groom || ""
          );

          setBride(
            data.bride || ""
          );

          setDate(
            data.date || ""
          );

          setAkadDate(
  data.akadDate || ""
);

setAkadTime(
  data.akadTime || ""
);

setAkadPlace(
  data.akadPlace || ""
);

setResepsiDate(
  data.resepsiDate || ""
);

setResepsiTime(
  data.resepsiTime || ""
);

setResepsiPlace(
  data.resepsiPlace || ""
);

          setCoverImage(
  data.coverImage || ""
);

setGroomImage(
  data.groomImage || ""
);

setBrideImage(
  data.brideImage || ""
);

setQrisImage(
  data.qrisImage || ""
);

setMapsUrl(
  data.mapsUrl || ""
);

setBankName(
  data.bankName || ""
);

setAccountNumber(
  data.accountNumber || ""
);

setAccountName(
  data.accountName || ""
);

setTheme(
  data.theme ||
  "elegant-gold"
);

setGallery(
  data.gallery || []
);

setGroomParents(
  data.groomParents || ""
);

setBrideParents(
  data.brideParents || ""
);

setGroomTitle(
  data.groomTitle || ""
);

setGroomFather(
  data.groomFather || ""
);

setGroomMother(
  data.groomMother || ""
);

setBrideTitle(
  data.brideTitle || ""
);

setBrideFather(
  data.brideFather || ""
);

setBrideMother(
  data.brideMother || ""
);

setOpeningHeading(
  data.openingHeading || ""
);

setOpeningContent(
  data.openingContent || ""
);

setLoveStory(
  data.loveStory || []
);

setMusicUrl(
  data.musicUrl || ""
);

setOwnerUid(
  data.uid || ""
);
        }
        

        setLoading(false);
      };

    load();

  }, [slug]);

  const save =
  async () => {

    console.log(
      "GALLERY SAAT DISIMPAN:",
      gallery
    );

    await updateDoc(
      doc(
        db,
        "invitations",
        slug
      ),
      {
        groom,
        bride,
        date,

        coverImage,
        groomImage,
        brideImage,

        qrisImage,

        mapsUrl,

        bankName,
        accountNumber,
        accountName,

        theme,

        akadDate,
        akadTime,
        akadPlace,

        resepsiDate,
        resepsiTime,
        resepsiPlace,

        gallery,
        groomParents,
brideParents,
groomTitle,
groomFather,
groomMother,

brideTitle,
brideFather,
brideMother,
loveStory,
musicUrl,
openingHeading,

openingContent,

updatedAt: serverTimestamp(),
      }
    );

    alert(
      "Berhasil disimpan"
    );
};

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow">

      <h1 className="text-4xl font-bold mb-8">
        Edit Undangan
      </h1>

      <div className="space-y-4">

        <input
          value={groom}
          onChange={(e) =>
            setGroom(
              toTitleCase(
              e.target.value
            ))
          }
          className="w-full border p-4 rounded-xl"
        />

        <input
          value={bride}
          onChange={(e) =>
            setBride(
              toTitleCase(
              e.target.value
            ))
          }
          className="w-full border p-4 rounded-xl"
        />

        <input
  value={groomTitle}
  onChange={(e)=>
    setGroomTitle(
      toTitleCase(
      e.target.value
    ))
  }
  placeholder="Putra Pertama"
  className="w-full border p-4 rounded-xl"
/>

<input
  value={groomFather}
  onChange={(e)=>
    setGroomFather(
      toTitleCase(
      e.target.value
    ))
  }
  placeholder="Nama Ayah"
  className="w-full border p-4 rounded-xl"
/>

<input
  value={groomMother}
  onChange={(e)=>
    setGroomMother(
      toTitleCase(
      e.target.value
    ))
  }
  placeholder="Nama Ibu"
  className="w-full border p-4 rounded-xl"
/>

<input
  value={brideTitle}
  onChange={(e)=>
    setBrideTitle(
      toTitleCase(
      e.target.value
    ))
  }
  placeholder="Putri Kedua"
  className="w-full border p-4 rounded-xl"
/>

<input
  value={brideFather}
  onChange={(e)=>
    setBrideFather(
      toTitleCase(
      e.target.value
    ))
  }
  placeholder="Nama Ayah"
  className="w-full border p-4 rounded-xl"
/>

<input
  value={brideMother}
  onChange={(e)=>
    setBrideMother(
      toTitleCase(
      e.target.value
    ))
  }
  placeholder="Nama Ibu"
  className="w-full border p-4 rounded-xl"
/>

        <input
          type="datetime-local"
          value={date}
          onChange={(e) =>
            setDate(
              e.target.value
            )
          }
          className="w-full border p-4 rounded-xl"
        />

        <h3 className="font-semibold mt-8">
  Akad Nikah
</h3>

<input
  value={akadDate}
  onChange={(e) =>
    setAkadDate(
      toTitleCase(
      e.target.value
    ))
  }
  placeholder="Tanggal Akad"
  className="w-full border p-4 rounded-xl"
/>

<input
  value={akadTime}
  onChange={(e) =>
    setAkadTime(
      toTitleCase(
      e.target.value
    ))
  }
  placeholder="Jam Akad"
  className="w-full border p-4 rounded-xl"
/>

<input
  value={akadPlace}
  onChange={(e) =>
    setAkadPlace(
      toTitleCase(
      e.target.value
    ))
  }
  placeholder="Lokasi Akad"
  className="w-full border p-4 rounded-xl"
/>

<h3 className="font-semibold mt-8">
  Resepsi
</h3>

<input
  value={resepsiDate}
  onChange={(e) =>
    setResepsiDate(
      toTitleCase(
      e.target.value
    ))
  }
  placeholder="Tanggal Resepsi"
  className="w-full border p-4 rounded-xl"
/>

<input
  value={resepsiTime}
  onChange={(e) =>
    setResepsiTime(
      toTitleCase(
      e.target.value
    ))
  }
  placeholder="Jam Resepsi"
  className="w-full border p-4 rounded-xl"
/>

<input
  value={resepsiPlace}
  onChange={(e) =>
    setResepsiPlace(
      toTitleCase(
      e.target.value
    ))
  }
  placeholder="Lokasi Resepsi"
  className="w-full border p-4 rounded-xl"
/>

        <h3>Cover</h3>

<ImageUpload
  path={`covers/${slug}`}
  onUploaded={
    setCoverImage
  }
/>

<h3>Foto Pria</h3>

<ImageUpload
  path={`groom/${slug}`}
  onUploaded={
    setGroomImage
  }
/>

<h3>Foto Wanita</h3>

<ImageUpload
  path={`bride/${slug}`}
  onUploaded={
    setBrideImage
  }
/>

<h3>QRIS</h3>

<ImageUpload
  path={`qris/${slug}`}
  onUploaded={
    setQrisImage
  }
/>

<input
  value={mapsUrl}
  onChange={(e) =>
    setMapsUrl(
      e.target.value
    )
  }
  placeholder="Google Maps URL"
  className="w-full border p-4 rounded-xl"
/>

<input
  value={bankName}
  onChange={(e) =>
    setBankName(
      toTitleCase(
      e.target.value
    ))
  }
  placeholder="Nama Bank"
  className="w-full border p-4 rounded-xl"
/>

<input
  value={accountNumber}
  onChange={(e) =>
    setAccountNumber(
      e.target.value
    )
  }
  placeholder="Nomor Rekening"
  className="w-full border p-4 rounded-xl"
/>

<input
  value={accountName}
  onChange={(e) =>
    setAccountName(
      toTitleCase(
      e.target.value
    ))
  }
  placeholder="Nama Pemilik Rekening"
  className="w-full border p-4 rounded-xl"
/>

<h3 className="font-semibold mt-8">
  Lagu Undangan
</h3>

<MusicUpload
  path={`music/${slug}`}
  onUploaded={
    setMusicUrl
  }
/>

{musicUrl && (

  <audio
    controls
    className="w-full mt-3"
  >
    <source
      src={musicUrl}
      type="audio/mpeg"
    />
  </audio>

)}

<div
className="
border
rounded-3xl
overflow-hidden
"
>

<img

src={currentTheme?.image}

alt={currentTheme?.name}

className="
w-full
h-60
object-cover
"

/>

<div
className="
p-6
"
>

<h3
className="
text-2xl
font-bold
"
>

{currentTheme?.name}

</h3>

<p
className="
text-zinc-500
mt-2
"
>

{currentTheme?.description}

</p>

<button
type="button"
onClick={() => setOpenThemeModal(true)}
className="
mt-6
bg-[#9A7B45]
text-white
px-6
py-3
rounded-xl
hover:bg-[#876c3d]
transition
"
>

Ganti Tema

</button>

</div>

</div>

<div className="mt-10">

  <h3 className="text-xl font-semibold mb-5">

    Opening

  </h3>

  <label className="font-medium">

    Judul Opening

  </label>

  <input

    value={openingHeading}

    onChange={(e)=>

      setOpeningHeading(
        e.target.value
      )

    }

    placeholder="Contoh: بِسْمِ اللّٰهِ..."

    className="
    w-full
    border
    p-4
    rounded-xl
    mt-2
    "

  />

  <label
    className="
    font-medium
    block
    mt-6
    "
  >

    Isi Opening

  </label>

  <textarea

    value={openingContent}

    onChange={(e)=>

      setOpeningContent(
        e.target.value
      )

    }

    rows={8}

    className="
    w-full
    border
    p-4
    rounded-xl
    mt-2
    "

  />

</div>

<div
className="
flex
gap-3
mt-5
"
>

<button

type="button"

onClick={useDefaultOpening}

className="
px-5
py-3
rounded-xl
border
"

>

Gunakan Default

</button>

<button

type="button"

onClick={()=>
setOpenOpeningModal(true)
}

className="
px-5
py-3
rounded-xl
bg-[#9A7B45]
text-white
"

>

Pilih Template Opening

</button>

</div>

<div className="mt-10">

  <h3 className="text-xl font-semibold mb-4">
    Love Story
  </h3>

  {loveStory.map(
    (story, index) => (

      <div
        key={index}
        className="
        border
        rounded-xl
        p-4
        mb-4
        "
      >

        <input
          value={story.year}
          placeholder="Tahun"
          onChange={(e) => {

            const updated =
              [...loveStory];

            updated[index].year =
              e.target.value;

            setLoveStory(updated);

          }}
          className="
          w-full
          border
          p-3
          rounded-lg
          mb-3
          "
        />

        <input
          value={story.title}
          placeholder="Judul"
          onChange={(e) => {

            const updated =
              [...loveStory];

            updated[index].title =
            toTitleCase(
              e.target.value);

            setLoveStory(updated);

          }}
          className="
          w-full
          border
          p-3
          rounded-lg
          mb-3
          "
        />

        <textarea
          value={story.description}
          placeholder="Cerita"
          onChange={(e) => {

            const updated =
              [...loveStory];

            updated[index].description =
            sentenceCase(
              e.target.value
            );

            setLoveStory(updated);

          }}
          className="
          w-full
          border
          p-3
          rounded-lg
          h-28
          "
        />

        <h4 className="font-medium mb-2">
  Foto Story
</h4>

<ImageUpload
  path={`lovestory/${slug}-${index}`}
  onUploaded={(url) => {

    const updated = [...loveStory];

    updated[index].image = url;

    setLoveStory(updated);

  }}
/>

{story.image && (
  <img
    src={story.image}
    alt=""
    className="
      w-full
      h-48
      object-cover
      rounded-xl
      mt-3
    "
  />
)}

        <button
          type="button"
          onClick={() => {

            const updated =
              loveStory.filter(
                (_, i) =>
                  i !== index
              );

            setLoveStory(updated);

          }}
          className="
          mt-3
          text-red-500
          "
        >
          Hapus Story
        </button>

      </div>

    )
  )}

  <button
    type="button"
    onClick={() =>
      setLoveStory([
        ...loveStory,
        {
          year: "",
          title: "",
          description: "",
        },
      ])
    }
    className="
    bg-blue-500
    text-white
    px-4
    py-2
    rounded-lg
    "
  >
    + Tambah Story
  </button>

  <h3 className="font-semibold mt-8">
  Gallery
</h3>

<GalleryUpload
  slug={slug}
  onUploaded={(urls) => {

  console.log(
    "UPLOAD URLS:",
    urls
  );

  setGallery((prev) => {

    const next = [
      ...prev,
      ...urls,
    ];

    console.log(
      "STATE GALLERY:",
      next
    );

    return next;
  });

}}
/>

<div className="grid grid-cols-2 gap-4 mt-4">

  {gallery.map((url) => (

    <img
      key={url}
      src={url}
      alt=""
      className="rounded-xl"
    />

  ))}

</div>

</div>

        <button
          onClick={save}
          className="bg-[#9A7B45] text-white px-6 py-4 rounded-xl"
        >
          Simpan
        </button>

      </div>

      <OpeningTemplateModal

open={openOpeningModal}

onClose={()=>

setOpenOpeningModal(false)

}

onSelect={(heading, content)=>{

setOpeningHeading(
heading
);

setOpeningContent(
content
);

}}

/>

<ThemePickerModal

open={openThemeModal}

current={theme}

onClose={()=>

setOpenThemeModal(false)

}

onSelect={(id)=>{

setTheme(id);

}}

/>

    </div>

    
  );
}
