export type DemoInvitation = {
  slug: string;
  theme: "luxury-black" | "elegant-gold";
  groom: string;
  bride: string;
  groomTitle: string;
  brideTitle: string;
  groomFather: string;
  groomMother: string;
  brideFather: string;
  brideMother: string;
  coverImage: string;
  groomImage: string;
  brideImage: string;
  date: string;
  akadDate: string;
  akadTime: string;
  akadPlace: string;
  resepsiDate: string;
  resepsiTime: string;
  resepsiPlace: string;
  mapsUrl: string;
  musicUrl: string;
  openingHeading: string;
  openingContent: string;
  loveStory: { year: string; title: string; description: string; image?: string }[];
  gallery: string[];
  bankName: string;
  accountNumber: string;
  accountName: string;
  demoMessages: { id: string; name: string; message: string }[];
};

const sharedOpening =
  "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami. Merupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.";

export const demoInvitations: Record<string, DemoInvitation> = {
  "demo-luxury-black": {
    slug: "demo-luxury-black",
    theme: "luxury-black",
    groom: "Raka Pratama",
    bride: "Nadira Putri",
    groomTitle: "Putra pertama",
    brideTitle: "Putri kedua",
    groomFather: "Hendra Pratama",
    groomMother: "Sulastri",
    brideFather: "Arif Santoso",
    brideMother: "Wulan Puspita",
    coverImage: "/images/invitation/demo/luxury-couple.svg",
    groomImage: "/images/invitation/demo/groom-portrait.svg",
    brideImage: "/images/invitation/demo/bride-portrait.svg",
    date: "2027-06-20T09:00:00+07:00",
    akadDate: "Minggu, 20 Juni 2027",
    akadTime: "08.00 WIB – selesai",
    akadPlace: "Masjid Agung Jawa Tengah, Semarang",
    resepsiDate: "Minggu, 20 Juni 2027",
    resepsiTime: "11.00 – 14.00 WIB",
    resepsiPlace: "The Amartya, Gajahmungkur, Semarang",
    mapsUrl: "https://maps.google.com/?q=The+Amartya+Semarang",
    musicUrl: "",
    openingHeading: "Assalamu’alaikum Warahmatullahi Wabarakatuh",
    openingContent: sharedOpening,
    loveStory: [
      { year: "2021", title: "Berawal dari pertemuan", description: "Kami berkenalan di sebuah acara komunitas. Percakapan sederhana hari itu menjadi awal kisah yang terus tumbuh.", image: "/images/invitation/demo/luxury-couple.svg" },
      { year: "2024", title: "Melangkah bersama", description: "Dengan dukungan keluarga, kami memantapkan hati untuk membangun masa depan bersama." },
    ],
    gallery: ["/images/invitation/demo/luxury-couple.svg", "/images/invitation/demo/luxury-details.svg"],
    bankName: "Bank Central Asia (BCA)",
    accountNumber: "1234567890",
    accountName: "Nadira Putri",
    demoMessages: [
      { id: "luxury-wish-1", name: "Dina & Fajar", message: "Selamat menempuh hidup baru. Semoga selalu rukun, bahagia, dan penuh berkah." },
      { id: "luxury-wish-2", name: "Keluarga Santoso", message: "Semoga menjadi keluarga sakinah, mawaddah, warahmah. Sampai bertemu di hari bahagia!" },
    ],
  },
  "demo-elegant-gold": {
    slug: "demo-elegant-gold",
    theme: "elegant-gold",
    groom: "Dimas Mahendra",
    bride: "Alya Khairunnisa",
    groomTitle: "Putra kedua",
    brideTitle: "Putri pertama",
    groomFather: "Budi Mahendra",
    groomMother: "Ratna Dewi",
    brideFather: "Yusuf Ramadhan",
    brideMother: "Nisa Azzahra",
    coverImage: "/images/invitation/demo/elegant-couple.svg",
    groomImage: "/images/invitation/demo/groom-portrait.svg",
    brideImage: "/images/invitation/demo/bride-portrait.svg",
    date: "2027-08-22T10:00:00+07:00",
    akadDate: "Minggu, 22 Agustus 2027",
    akadTime: "09.00 WIB – selesai",
    akadPlace: "Masjid Raya Bandung, Kota Bandung",
    resepsiDate: "Minggu, 22 Agustus 2027",
    resepsiTime: "12.00 – 15.00 WIB",
    resepsiPlace: "Gedung Hegarmanah, Cidadap, Bandung",
    mapsUrl: "https://maps.google.com/?q=Gedung+Hegarmanah+Bandung",
    musicUrl: "",
    openingHeading: "Assalamu’alaikum Warahmatullahi Wabarakatuh",
    openingContent: sharedOpening,
    loveStory: [
      { year: "2020", title: "Satu langkah kecil", description: "Kami bertemu melalui sahabat yang sama. Dari obrolan ringan, kami menemukan banyak mimpi yang ingin dirangkai bersama.", image: "/images/invitation/demo/elegant-couple.svg" },
      { year: "2025", title: "Sebuah janji", description: "Kedua keluarga bertemu dan merestui niat kami untuk melangkah ke babak baru kehidupan." },
    ],
    gallery: ["/images/invitation/demo/elegant-couple.svg", "/images/invitation/demo/elegant-details.svg"],
    bankName: "Bank Mandiri",
    accountNumber: "9876543210",
    accountName: "Alya Khairunnisa",
    demoMessages: [
      { id: "elegant-wish-1", name: "Rani & Bagas", message: "Selamat berbahagia, Dimas dan Alya! Semoga cinta kalian selalu bertumbuh setiap hari." },
      { id: "elegant-wish-2", name: "Keluarga Ramadhan", message: "Semoga Allah melimpahkan keberkahan dan kebahagiaan untuk keluarga baru kalian." },
    ],
  },
};
