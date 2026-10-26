import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Download, ExternalLink } from "lucide-react";
import { dashboardProducts } from "@/modules/dashboard/dashboard.data";

const playStoreUrl =
  "https://play.google.com/store/apps/details?id=com.ks25.mitraumkm&pcampaignid=web_share";
const indexableProducts = dashboardProducts.filter((product) =>
  ["pos", "attendance", "packflow", "live-assistant"].includes(product.moduleId),
);
const screenshotLabels: Record<string, string[]> = {
  pos: ["Ringkasan POS", "Transaksi kasir", "Pemesanan QR", "Laporan penjualan bulanan"],
  attendance: ["Ringkasan absensi", "Pencatatan selfie", "Pengajuan cuti"],
  packflow: ["Ringkasan PackFlow", "Daftar resi dan paket aktif"],
  "live-assistant": ["Sampul Live Assistant", "Playlist", "Katalog produk", "Teleprompter", "Generator skrip AI", "Riwayat sesi"],
};

function findProduct(moduleId: string) {
  return indexableProducts.find((product) => product.moduleId === moduleId);
}

export function generateStaticParams() {
  return indexableProducts.map(({ moduleId }) => ({ moduleId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}): Promise<Metadata> {
  const { moduleId } = await params;
  const product = findProduct(moduleId);
  if (!product) return { title: "Aplikasi Tidak Ditemukan" };

  const titleByModule: Record<string, string> = {
    pos: "Aplikasi Kasir POS untuk UMKM",
    attendance: "Aplikasi Absensi Karyawan Online",
    packflow: "Aplikasi Pengelolaan Resi dan Packing",
    "live-assistant": "Aplikasi Teleprompter Live Shopping",
  };
  return {
    title: titleByModule[moduleId],
    description: product.longDescription,
    keywords: [product.name, product.description, ...product.features.map(({ title }) => title)],
    alternates: { canonical: `/aplikasi/${moduleId}` },
    openGraph: {
      title: `${titleByModule[moduleId]} | KS25 Digital Studio`,
      description: product.longDescription,
      type: "article",
      images: [product.heroImage],
    },
  };
}

export default async function ProductLandingPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const product = findProduct(moduleId);
  if (!product) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: product.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Android, Web",
        description: product.longDescription,
        image: `https://www.ks25studio.web.id${product.heroImage}`,
        downloadUrl: playStoreUrl,
      },
      {
        "@type": "Article",
        headline: `${product.name}: fitur dan manfaat untuk bisnis`,
        description: product.longDescription,
        image: `https://www.ks25studio.web.id${product.heroImage}`,
        author: { "@type": "Organization", name: "KS25 Digital Studio" },
        publisher: { "@type": "Organization", name: "KS25 Digital Studio" },
        mainEntityOfPage: `https://www.ks25studio.web.id/aplikasi/${moduleId}`,
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
          <Link href="/artikel/ks25-kasir-pos-absensi" className="text-lg font-bold text-violet-700">KS25 Digital Studio</Link>
          <Link href="/register" className="text-sm font-semibold text-violet-700">Buat Akun</Link>
        </nav>
      </header>

      <article className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:pt-16">
        <nav aria-label="Breadcrumb" className="mb-7 text-sm text-slate-500">
          <Link href="/artikel/ks25-kasir-pos-absensi" className="hover:text-violet-700">Artikel KS25</Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </nav>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-violet-700">{product.description}</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{product.name}</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">{product.longDescription}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-violet-700 px-5 font-semibold text-white hover:bg-violet-800">
                Mulai dengan KS25 <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={playStoreUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 font-semibold hover:bg-slate-100">
                <Download className="h-4 w-4" /> Instal Android
              </a>
            </div>
            <p className="mt-4 text-sm text-slate-500">Tersedia melalui Android dan dashboard web.</p>
          </div>
          <Image
            src={product.heroImage}
            alt={`${product.name}, ${product.description}`}
            width={1200}
            height={900}
            priority
            className="h-auto max-h-[520px] w-full rounded-3xl border bg-white object-contain shadow-lg"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <section className="mt-20">
          <p className="text-sm font-semibold uppercase tracking-[.16em] text-violet-700">Fitur {product.name}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">Apa yang dapat Anda lakukan dengan {product.name}?</h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">
            {product.name} menggabungkan alat yang membantu pekerjaan harian menjadi lebih teratur. Berikut fitur utama dan manfaatnya untuk pemilik usaha, karyawan, dan tim operasional.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {product.features.map((feature) => (
              <section key={feature.title} className="rounded-2xl border bg-white p-6 shadow-sm">
                <span aria-hidden="true" className="text-3xl">{feature.icon}</span>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{feature.description}</p>
              </section>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-violet-700">Cara menggunakan</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Alur kerja yang praktis</h2>
            <p className="mt-4 leading-7 text-slate-600">Ikuti tahapan berikut untuk mulai memakai fitur {product.name} sesuai kebutuhan.</p>
          </div>
          <ol className="space-y-4">
            {product.workflows.map((step, index) => (
              <li key={step.title} className="flex gap-4 rounded-2xl border bg-white p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-800">{index + 1}</span>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 leading-7 text-slate-600">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {product.tutorials.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold tracking-tight">Panduan memulai {product.name}</h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">Gunakan panduan singkat ini untuk memahami langkah awal dan membangun kebiasaan kerja yang sesuai dengan kebutuhan bisnis.</p>
            <div className="mt-7 grid gap-5 md:grid-cols-3">
              {product.tutorials.map((tutorial) => (
                <section key={tutorial.title} className="rounded-2xl border bg-white p-6">
                  <h3 className="font-semibold">{tutorial.title}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{tutorial.description}</p>
                </section>
              ))}
            </div>
          </section>
        )}

        {product.screenshots.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold tracking-tight">Tampilan {product.name}</h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">Lihat beberapa tampilan aplikasi yang mendukung aktivitas kerja di {product.name}.</p>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {product.screenshots.map((image, index) => (
                <figure key={image} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                  <Image src={image} alt={`${product.name}: ${screenshotLabels[product.moduleId]?.[index] ?? `tampilan ${index + 1}`}`} width={900} height={700} className="h-64 w-full object-contain p-2" sizes="(max-width: 768px) 100vw, 33vw" />
                  <figcaption className="border-t p-4 text-sm text-slate-600">{screenshotLabels[product.moduleId]?.[index] ?? `Tampilan ${product.name} ${index + 1}`}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className="mt-20">
          <h2 className="text-3xl font-bold tracking-tight">Pertanyaan tentang {product.name}</h2>
          <div className="mt-6 divide-y divide-slate-200 rounded-2xl border bg-white px-6">
            {product.faq.map((item) => (
              <div key={item.question} className="py-5">
                <h3 className="font-semibold">{item.question}</h3>
                <p className="mt-2 leading-7 text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <nav aria-label="Modul KS25 lainnya" className="mt-16 rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold">Jelajahi modul KS25 lainnya</h2>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
            {indexableProducts.filter((item) => item.moduleId !== product.moduleId).map((item) => (
              <Link key={item.moduleId} href={`/aplikasi/${item.moduleId}`} className="font-medium text-violet-700 underline underline-offset-4">
                {item.name}
              </Link>
            ))}
            <Link href="/artikel/ks25-kasir-pos-absensi" className="font-medium text-violet-700 underline underline-offset-4">
              Artikel KS25 POS dan Absensi
            </Link>
          </div>
        </nav>

        <section className="mt-20 rounded-3xl bg-gradient-to-br from-violet-800 to-fuchsia-700 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-3xl font-bold">Siap mencoba {product.name}?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/85">Daftar untuk mulai menggunakan KS25 melalui web, atau instal aplikasi Android dari Google Play.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 font-semibold text-violet-800 hover:bg-violet-50">Registrasi / Get Started <ArrowRight className="h-4 w-4" /></Link>
            <a href={playStoreUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/50 px-5 font-semibold hover:bg-white/10">Buka Google Play <ExternalLink className="h-4 w-4" /></a>
          </div>
          <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-white/90">
            {product.features.slice(0, 3).map((feature) => <li key={feature.title} className="inline-flex items-center gap-2"><Check className="h-4 w-4" />{feature.title}</li>)}
          </ul>
        </section>
      </article>
      <footer className="border-t bg-white py-6 text-center text-sm text-slate-500">© {new Date().getFullYear()} KS25 Digital Studio</footer>
    </main>
  );
}
