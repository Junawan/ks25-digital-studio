export interface ProductFeature {

  icon: string;

  title: string;

  description: string;

}

export interface ProductWorkflow {

  title: string;

  description: string;

}

export interface ProductTutorial {

  title: string;

  description: string;

}

export interface ProductFaq {

  question: string;

  answer: string;

}

export interface DashboardProduct {

  moduleId: string;

  name: string;

  description: string;

  longDescription: string;

  version: string;

  image: string;

  logo: string;

  heroImage: string;

  screenshots: string[];

  category:
    | "sales"
    | "business"
    | "fulfillment"
    | "creative";

  color: string;

  ready: boolean;

  route: string;

  features: ProductFeature[];

  workflows: ProductWorkflow[];

  tutorials: ProductTutorial[];

  faq: ProductFaq[];

}

export const dashboardProducts: DashboardProduct[] = [

  {
  moduleId: "live-assistant",

  name: "KS25 Live Assistant",

  description:
    "AI Teleprompter untuk Live Shopping",

  longDescription:
    "KS25 Live Assistant membantu host melakukan live shopping lebih profesional menggunakan AI Teleprompter, Playlist, Generate AI, Bluetooth Remote dan Presenter Mode.",

  version: "1.0.0",

  image:
    "/images/modules/live2.png",

  heroImage:
    "/images/modules/live2.png",

    screenshots: [

"/images/modules/live-cover.png",

"/images/modules/live-playlist.png",

"/images/modules/live-products.png",

"/images/modules/live-teleprompter.png",

"/images/modules/live-ai.png",

"/images/modules/live-history.png",

],

  logo:
    "/images/modules/live2.png",

  category: "sales",

  color:
    "from-violet-600 via-violet-500 to-fuchsia-600",

  ready: true,

  route:
    "/live-assistant",

  features: [

    {

      icon: "🤖",

      title: "AI Script",

      description:
        "Generate script produk otomatis menggunakan AI."

    },

    {

      icon: "📺",

      title: "Teleprompter",

      description:
        "Scroll otomatis dengan kontrol penuh."

    },

    {

      icon: "📂",

      title: "Playlist",

      description:
        "Susun urutan produk sebelum live."

    },

    {

      icon: "🎙",

      title: "Presenter Mode",

      description:
        "Tampilan fullscreen khusus host."

    },

    {

      icon: "📱",

      title: "Bluetooth Remote",

      description:
        "Kontrol presentasi tanpa menyentuh layar."

    },

    {

      icon: "⚡",

      title: "Bulk AI",

      description:
        "Generate ratusan produk sekaligus."

    },

  ],

  workflows: [

    {

      title: "Import Produk",

      description:
        "Masukkan seluruh produk marketplace."

    },

    {

      title: "Buat Playlist",

      description:
        "Susun urutan live."

    },

    {

      title: "Generate AI",

      description:
        "Buat script AI otomatis."

    },

    {

      title: "Presenter",

      description:
        "Mulai teleprompter."

    },

  ],

  tutorials: [

    {

      title: "Import Produk",

      description:
        "Pelajari cara import produk."

    },

    {

      title: "Generate AI",

      description:
        "Pelajari AI Generator."

    },

    {

      title: "Membuat Playlist",

      description:
        "Susun playlist live."

    },

    {

      title: "Bluetooth Remote",

      description:
        "Hubungkan remote Bluetooth."

    },

  ],

  faq: [

    {

      question:
        "Apakah bisa digunakan di HP?",

      answer:
        "Ya, Live Assistant mendukung Android."

    },

    {

      question:
        "Apakah membutuhkan internet?",

      answer:
        "Generate AI membutuhkan internet, Teleprompter tetap dapat digunakan setelah data tersimpan."

    },

  ],

},

  {
  moduleId: "pos",

  name: "KS25 POS",

  description:
    "Aplikasi kasir modern untuk UMKM.",

  longDescription:
    "KS25 POS membantu mengelola transaksi penjualan, QRIS, stok, laporan penjualan, dan operasional toko secara modern.",

  version: "Coming Soon",

  image: "/images/modules/pos2.png",

  heroImage: "/images/modules/pos2.png",

  screenshots: [],

  logo: "/images/modules/pos2.png",

  category: "business",

  color: "from-blue-600 to-cyan-600",

  ready: false,

  route: "#",

  features: [],

  workflows: [],

  tutorials: [],

  faq: [],

},

  {
  moduleId: "store",

  name: "KS25 Store",

  description:
    "Website toko online profesional.",

  longDescription:
    "KS25 Store membantu membuat website toko online modern yang terintegrasi dengan pembayaran, pengiriman, dan katalog produk.",

  version: "Coming Soon",

  image: "/images/modules/store2.png",

  heroImage: "/images/modules/store2.png",

  screenshots: [],

  logo: "/images/modules/store2.png",

  category: "sales",

  color: "from-emerald-600 to-green-600",

  ready: false,

  route: "#",

  features: [],

  workflows: [],

  tutorials: [],

  faq: [],

},

  {
  moduleId: "attendance",

  name: "KS25 Attendance",

  description:
    "Absensi karyawan berbasis cloud.",

  longDescription:
    "KS25 Attendance memudahkan pencatatan kehadiran, izin, cuti, dan laporan absensi secara realtime.",

  version: "Coming Soon",

  image: "/images/modules/attendance2.png",

  heroImage: "/images/modules/attendance2.png",

  screenshots: [],

  logo: "/images/modules/attendance2.png",

  category: "business",

  color: "from-orange-500 to-amber-500",

  ready: false,

  route: "#",

  features: [],

  workflows: [],

  tutorials: [],

  faq: [],

},

  {
  moduleId: "invitation",

  name: "KS25 Invitation",

  description:
    "Website undangan digital premium.",

  longDescription:
    "KS25 Invitation membantu membuat website undangan digital premium lengkap dengan RSVP, galeri, countdown, dan buku tamu.",

  version: "Coming Soon",

  image: "/images/modules/invitation2.png",

  heroImage: "/images/modules/invitation2.png",

  screenshots: [],

  logo: "/images/modules/invitation2.png",

  category: "creative",

  color: "from-pink-500 to-rose-500",

  ready: false,

  route: "#",

  features: [],

  workflows: [],

  tutorials: [],

  faq: [],

},

  {
  moduleId: "packflow",

  name: "KS25 PackFlow",

  description:
    "Scanner resi dan monitoring packing.",

  longDescription:
    "KS25 PackFlow membantu proses packing pesanan dengan scanner resi, monitoring status packing, dan mencegah resi ganda.",

  version: "Coming Soon",

  image: "/images/modules/packflow2.png",

  heroImage: "/images/modules/packflow2.png",

  screenshots: [],

  logo: "/images/modules/packflow2.png",

  category: "fulfillment",

  color: "from-cyan-500 to-sky-500",

  ready: false,

  route: "#",

  features: [],

  workflows: [],

  tutorials: [],

  faq: [],

},

];