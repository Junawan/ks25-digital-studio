import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Download, Globe2, Smartphone } from "lucide-react";

const playStoreUrl =
  "https://play.google.com/store/apps/details?id=com.ks25.mitraumkm&pcampaignid=web_share";

export const metadata: Metadata = {
  title: "KS25 Kasir POS & Absensi: Aplikasi Usaha untuk Android dan Web",
  description:
    "Kenali KS25 Kasir POS & Absensi, aplikasi usaha untuk mengelola transaksi, stok, laporan penjualan, dan kehadiran karyawan dari Android maupun web.",
  keywords: [
    "aplikasi kasir UMKM",
    "aplikasi POS Android",
    "aplikasi kasir online",
    "aplikasi absensi karyawan",
    "KS25 POS",
    "KS25 Absensi",
  ],
  alternates: { canonical: "/artikel/ks25-kasir-pos-absensi" },
  openGraph: {
    title: "KS25 Kasir POS & Absensi untuk Android dan Web",
    description:
      "Satu platform untuk membantu mengelola penjualan, stok, laporan usaha, dan absensi karyawan.",
    type: "article",
    images: ["/ads/ks25-pos-showcase.png"],
  },
};

const benefits = [
  "Catat transaksi penjualan dan pantau riwayat transaksi.",
  "Kelola produk, harga, stok, pelanggan, dan pemasok.",
  "Pantau pemasukan, pengeluaran, piutang, dan laporan usaha.",
  "Atur kehadiran tim dengan pencatatan absensi berbasis selfie.",
  "Akses aplikasi melalui Android atau browser web.",
];

export default function Ks25PosAttendanceArticle() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "KS25 Kasir POS & Absensi: Aplikasi Usaha untuk Android dan Web",
        description: metadata.description,
        image: "https://www.ks25studio.web.id/ads/ks25-pos-showcase.png",
        author: { "@type": "Organization", name: "KS25 Digital Studio" },
        publisher: { "@type": "Organization", name: "KS25 Digital Studio" },
        mainEntityOfPage: "https://www.ks25studio.web.id/artikel/ks25-kasir-pos-absensi",
      },
      {
        "@type": "SoftwareApplication",
        name: "KS25 Kasir POS & Absensi",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Android, Web",
        description:
          "Platform usaha untuk mengelola transaksi POS, produk, stok, laporan penjualan, dan absensi karyawan.",
        downloadUrl: playStoreUrl,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-lg font-bold tracking-tight text-violet-700">
            KS25 Digital Studio
          </Link>
          <Link href="/register" className="text-sm font-semibold text-violet-700 hover:text-violet-900">
            Mulai Gratis
          </Link>
        </nav>
      </header>

      <article className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[.18em] text-violet-700">
              Solusi digital untuk bisnis Indonesia
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              KS25 Kasir POS &amp; Absensi, satu aplikasi untuk bantu usaha lebih tertata
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Kelola transaksi, produk, stok, laporan penjualan, dan kehadiran tim dalam satu
              platform. KS25 dapat digunakan melalui aplikasi Android maupun web, sehingga Anda
              bisa mengelola operasional usaha dengan lebih praktis.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 font-semibold text-white shadow-sm hover:bg-violet-800"
              >
                Buat Akun KS25 <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 font-semibold hover:bg-slate-100"
              >
                <Download className="h-4 w-4" /> Instal di Google Play
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2"><Smartphone className="h-4 w-4 text-violet-700" /> Android</span>
              <span className="inline-flex items-center gap-2"><Globe2 className="h-4 w-4 text-violet-700" /> Web di PC, laptop, dan ponsel</span>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-violet-100 shadow-xl">
            <Image
              src="/ads/ks25-pos-showcase.png"
              alt="Tampilan aplikasi kasir KS25 POS untuk mengelola penjualan usaha"
              width={1200}
              height={900}
              priority
              className="h-auto w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
          </div>
        </div>

        <section className="mt-20 grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-violet-700">Kenali platformnya</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Apa itu KS25 Kasir POS &amp; Absensi?</h2>
          </div>
          <div className="space-y-4 text-base leading-8 text-slate-600">
            <p>
              KS25 Digital Studio adalah platform operasional usaha dengan modul KS25 POS dan
              KS25 Absensi. Aplikasi kasir POS membantu pemilik UMKM mencatat penjualan dan
              mengelola informasi toko, sementara modul absensi membantu perusahaan mencatat
              kehadiran karyawan.
            </p>
            <p>
              Dashboard web memudahkan pengelolaan dari layar yang lebih luas, sedangkan aplikasi
              Android praktis untuk digunakan saat bekerja di toko atau saat bepergian. Data dan
              akses aplikasi mengikuti akun serta perusahaan yang Anda gunakan.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-violet-700">Fitur utama</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Fitur aplikasi kasir dan manajemen usaha KS25</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Kelola aktivitas penting toko dan tim melalui modul yang dirancang agar pekerjaan
              harian terasa lebih ringkas.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <FeatureCard
              image="/ads/pos_transaksi.jpg"
              alt="Proses transaksi dengan aplikasi kasir KS25 POS"
              title="Kasir dan transaksi penjualan"
              text="Catat transaksi, lihat riwayat penjualan, dan kelola proses pembayaran dari modul POS. Alur kasir digital membantu pemilik usaha meninjau aktivitas penjualan dengan lebih mudah."
            />
            <FeatureCard
              image="/ads/ks25-pos-monthly-report-android-frame.png"
              alt="Laporan bulanan penjualan pada KS25 POS Android"
              title="Produk, stok, dan laporan"
              text="Kelola katalog produk, harga, persediaan, pelanggan, dan pemasok. Ringkasan laporan membantu Anda melihat performa penjualan serta mencatat pemasukan dan pengeluaran usaha."
            />
            <FeatureCard
              image="/ads/order_by_qr.jpg"
              alt="Pemesanan melalui QR pada ekosistem KS25 POS"
              title="Pemesanan digital dan operasional toko"
              text="Dukung pengalaman pemesanan pelanggan dengan fitur order melalui QR. Modul POS juga menyediakan pengelolaan piutang, pengeluaran, dan pemasukan lain agar catatan operasional lebih rapi."
            />
            <FeatureCard
              image="/ads/ks25-attendance-showcase.png"
              alt="Fitur absensi karyawan KS25 dengan pencatatan kehadiran selfie"
              title="Absensi karyawan berbasis selfie"
              text="Catat kehadiran tim melalui modul KS25 Absensi, lengkapi pencatatan dengan selfie, dan kelola informasi kehadiran serta pengajuan cuti dalam satu platform."
            />
          </div>
        </section>

        <section className="mt-20 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-10">
          <h2 className="text-3xl font-bold tracking-tight">Keunggulan KS25 untuk UMKM dan tim usaha</h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">
            Dengan aplikasi POS dan absensi dalam satu ekosistem, pemilik bisnis dapat mengurangi
            pencatatan yang tersebar dan memperoleh gambaran operasional yang lebih teratur.
          </p>
          <ul className="mt-7 grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 leading-7 text-slate-700">
                <Check className="mt-1 h-5 w-5 shrink-0 text-emerald-600" /> {benefit}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 grid items-center gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Bisa digunakan di Android dan web</h2>
            <p className="mt-4 leading-8 text-slate-600">
              Pilih cara kerja yang sesuai kebutuhan. Instal aplikasi KS25 di Android untuk akses
              praktis, atau masuk melalui browser web di komputer dan laptop untuk mengelola
              operasional dari dashboard. Mulai dengan membuat akun, lalu gunakan modul yang
              tersedia pada workspace Anda.
            </p>
          </div>
          <Image
            src="/ads/dashboard-utama.png"
            alt="Dashboard utama KS25 Digital Studio untuk mengakses berbagai modul usaha"
            width={1200}
            height={900}
            className="h-auto w-full rounded-3xl border bg-white shadow-lg"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </section>

        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight">Pertanyaan umum tentang KS25 POS dan Absensi</h2>
          <div className="mt-7 divide-y divide-slate-200 rounded-2xl border bg-white px-6">
            <div className="py-5">
              <h3 className="font-semibold">Apakah KS25 bisa digunakan di Android?</h3>
              <p className="mt-2 leading-7 text-slate-600">Ya. Instal aplikasi KS25 melalui Google Play untuk menggunakan fitur yang tersedia di Android.</p>
            </div>
            <div className="py-5">
              <h3 className="font-semibold">Apakah KS25 bisa dibuka melalui web?</h3>
              <p className="mt-2 leading-7 text-slate-600">Ya. Masuk ke KS25 melalui browser di komputer, laptop, atau perangkat lain untuk mengakses dashboard web.</p>
            </div>
            <div className="py-5">
              <h3 className="font-semibold">Bagaimana cara mulai menggunakan KS25?</h3>
              <p className="mt-2 leading-7 text-slate-600">Buat akun melalui halaman registrasi, siapkan workspace usaha, lalu buka modul POS atau Absensi sesuai kebutuhan Anda.</p>
            </div>
          </div>
        </section>

        <section className="mt-20 rounded-3xl bg-gradient-to-br from-violet-800 to-fuchsia-700 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-3xl font-bold tracking-tight">Mulai kelola usaha dengan KS25</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/85">
            Buat akun untuk mulai menjelajahi KS25 POS dan Absensi, atau instal aplikasi Android
            melalui Google Play.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 font-semibold text-violet-800 hover:bg-violet-50">
              Get Started — Daftar Sekarang <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={playStoreUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/50 px-5 font-semibold hover:bg-white/10">
              <Download className="h-4 w-4" /> Download Play Store
            </a>
          </div>
        </section>
      </article>
      <footer className="border-t bg-white py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} KS25 Digital Studio
      </footer>
    </main>
  );
}

function FeatureCard({
  image,
  alt,
  title,
  text,
}: {
  image: string;
  alt: string;
  title: string;
  text: string;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="relative aspect-[16/9] bg-slate-100">
        <Image src={image} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-3 leading-7 text-slate-600">{text}</p>
      </div>
    </section>
  );
}
