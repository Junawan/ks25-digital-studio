export interface ProductFeature {

  icon: string;

  title: string;

  description: string;

}

export type DashboardProductStatus =
  | "stable"
  | "beta"
  | "coming-soon";

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

  status: DashboardProductStatus;

}

export const dashboardProducts: DashboardProduct[] = [

  {
  moduleId: "live-assistant",

  name: "KS25 Live Assistant",

  description:
    "Aplikasi teleprompter dan pengelola skrip live shopping.",

  longDescription:
    "KS25 Live Assistant adalah aplikasi pendamping live shopping untuk membantu host menyiapkan produk, menyusun urutan presentasi, dan membaca poin penjualan saat siaran. Kelola katalog produk dan playlist, buat draf skrip dengan AI, lalu gunakan teleprompter layar penuh dengan kontrol gulir dan remote Bluetooth yang kompatibel. Persiapan lebih teratur membantu host menyampaikan informasi produk dengan percaya diri di setiap sesi live.",

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

    { icon: "🗂️", title: "Katalog Produk", description: "Simpan informasi dan detail produk agar mudah disiapkan untuk sesi live berikutnya." },
    { icon: "🕘", title: "Riwayat Live", description: "Lihat kembali sesi live yang telah dibuat dan lanjutkan persiapan konten." },

  ],

  workflows: [

    {

      title: "Import Produk",

      description:
        "Tambahkan detail produk secara manual atau gunakan fitur impor yang tersedia agar katalog presentasi lebih cepat disiapkan."

    },

    {

      title: "Buat Playlist",

      description:
        "Pilih produk dan atur urutannya menjadi playlist sesuai tema atau jadwal siaran."

    },

    {

      title: "Generate AI",

      description:
        "Gunakan Generate AI untuk membuat draf poin promosi berdasarkan informasi produk, lalu tinjau dan sesuaikan bahasanya."

    },

    {

      title: "Presenter",

      description:
        "Buka Presenter Mode untuk membaca skrip melalui teleprompter saat live berlangsung."

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

    { question: "Apakah skrip bisa disesuaikan sebelum siaran?", answer: "Ya. Draf skrip dapat ditinjau dan disunting agar sesuai dengan karakter host, informasi produk, dan gaya komunikasi toko." },
    { question: "Bagaimana cara menggunakan playlist?", answer: "Pilih produk yang akan dibawakan, susun urutannya, lalu buka playlist di Presenter Mode untuk mengikuti alur presentasi." },

  ],

  status: "stable",

},

  {
  moduleId: "pos",

  name: "KS25 POS",

  description:
    "Aplikasi kasir modern untuk UMKM.",

  longDescription:
    "KS25 POS adalah aplikasi kasir digital untuk membantu UMKM mencatat transaksi dan mengelola aktivitas toko dalam satu sistem. Kelola katalog produk, variasi, stok, pelanggan, pemasok, pemasukan, pengeluaran, dan piutang. Pantau riwayat serta laporan penjualan dari aplikasi Android atau dashboard web, dan manfaatkan pemesanan QR untuk memudahkan pelanggan membuat pesanan.",

  version: "1.0.0",

  image: "/images/modules/pos2.png",

  heroImage: "/images/modules/pos2.png",

  screenshots: [
    "/ads/ks25-pos-showcase.png",
    "/ads/pos_transaksi.jpg",
    "/ads/order_by_qr.jpg",
    "/ads/ks25-pos-monthly-report-android-frame.png",
  ],

  logo: "/images/modules/pos2.png",

  category: "business",

  color: "from-blue-600 to-cyan-600",

  ready: true,

  route: "/pos",

  features: [
    { icon: "🧾", title: "Transaksi Kasir", description: "Catat penjualan, kelola keranjang belanja, pilih metode pembayaran, dan telusuri riwayat transaksi toko." },
    { icon: "📦", title: "Produk dan Stok", description: "Atur katalog, harga, varian, dan jumlah stok produk agar informasi barang tetap tertata." },
    { icon: "📊", title: "Laporan Penjualan", description: "Tinjau ringkasan dan laporan penjualan untuk membantu mengevaluasi aktivitas usaha." },
    { icon: "🔳", title: "Pemesanan QR", description: "Sediakan alur pemesanan dengan QR agar pelanggan dapat melihat dan mengirim pesanan secara praktis." },
    { icon: "👥", title: "Pelanggan dan Kasir", description: "Kelola data pelanggan, pemasok, dan kasir sesuai kebutuhan operasional toko." },
    { icon: "💰", title: "Keuangan Toko", description: "Catat pengeluaran, pemasukan lain, dan piutang untuk melengkapi pemantauan usaha." },
  ],

  workflows: [
    { title: "Siapkan Katalog", description: "Masukkan nama produk, harga, varian, dan stok awal sebelum memulai transaksi." },
    { title: "Catat Penjualan", description: "Pilih produk ke keranjang, periksa jumlah dan total, lalu lanjutkan proses pembayaran." },
    { title: "Pantau Aktivitas", description: "Tinjau riwayat transaksi dan laporan untuk mengikuti perkembangan penjualan." },
    { title: "Kelola Operasional", description: "Perbarui persediaan serta catat pengeluaran, pemasukan lain, dan piutang secara berkala." },
  ],

  tutorials: [
    { title: "Memulai KS25 POS", description: "Buat katalog produk dan lengkapi harga serta stok agar kasir siap digunakan." },
    { title: "Membuat Transaksi", description: "Pilih barang yang dibeli, periksa keranjang, dan selesaikan transaksi sesuai metode pembayaran." },
    { title: "Membaca Laporan", description: "Gunakan menu laporan dan riwayat untuk meninjau transaksi pada periode yang dipilih." },
  ],

  faq: [
    { question: "Apakah KS25 POS bisa digunakan di Android dan web?", answer: "Ya. KS25 dapat diakses melalui aplikasi Android dan dashboard web menggunakan akun usaha Anda." },
    { question: "Apakah stok produk dapat dikelola dari aplikasi kasir?", answer: "KS25 POS menyediakan pengelolaan katalog dan stok agar data persediaan produk dapat diperbarui saat operasional." },
    { question: "Apakah tersedia laporan penjualan?", answer: "Ya. Modul POS menyediakan riwayat dan laporan penjualan untuk membantu pemilik usaha meninjau transaksi." },
  ],

  status: "stable",

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

  status: "coming-soon",

},

  {
  moduleId: "attendance",

  name: "KS25 Absensi",

  description:
    "Absensi karyawan berbasis cloud.",

  longDescription:
    "KS25 Absensi adalah aplikasi absensi karyawan untuk membantu usaha dan perusahaan mencatat kehadiran tim secara teratur. Karyawan dapat melakukan pencatatan kehadiran dengan selfie, sementara pengelola dapat meninjau catatan, mengelola informasi, dan memproses pengajuan cuti. Gunakan modul melalui Android atau web untuk mendukung pemantauan kehadiran dari kantor maupun saat tim bekerja di lapangan.",

  version: "1.0.0",

  image: "/images/modules/attendance2.png",

  heroImage: "/images/modules/attendance2.png",

  screenshots: [
    "/ads/ks25-attendance-showcase.png",
    "/ads/absen_selfi.jpg",
    "/ads/ks25-attendance-leave-android-frame.png",
  ],

  logo: "/images/modules/attendance2.png",

  category: "business",

  color: "from-orange-500 to-amber-500",

  ready: true,

  route: "/attendance",

  features: [
    { icon: "🤳", title: "Absensi dengan Selfie", description: "Catat kehadiran menggunakan selfie sebagai bagian dari proses absensi karyawan." },
    { icon: "🗓️", title: "Catatan Kehadiran", description: "Kelola data kehadiran karyawan agar riwayat kerja tim lebih mudah ditinjau." },
    { icon: "🏖️", title: "Pengajuan Cuti", description: "Ajukan dan tinjau permintaan cuti karyawan melalui alur yang tersedia di aplikasi." },
    { icon: "📢", title: "Informasi Tim", description: "Bagikan informasi yang relevan untuk karyawan dalam satu tempat yang terhubung dengan workspace." },
    { icon: "🏢", title: "Workspace Perusahaan", description: "Atur profil karyawan dan data absensi dalam workspace perusahaan yang sedang aktif." },
    { icon: "📱", title: "Akses Android dan Web", description: "Gunakan ponsel Android untuk pencatatan praktis atau browser web untuk pengelolaan tim." },
  ],

  workflows: [
    { title: "Siapkan Data Karyawan", description: "Lengkapi profil karyawan dan informasi perusahaan sebelum tim mulai melakukan absensi." },
    { title: "Catat Kehadiran", description: "Karyawan membuka modul absensi dan mengikuti instruksi pencatatan kehadiran dengan selfie." },
    { title: "Tinjau Riwayat", description: "Pengelola memeriksa catatan kehadiran tim melalui modul yang sesuai." },
    { title: "Kelola Cuti dan Informasi", description: "Tinjau permintaan cuti dan sampaikan informasi tim melalui fitur yang tersedia." },
  ],

  tutorials: [
    { title: "Mengundang Tim ke Absensi", description: "Siapkan profil anggota tim pada workspace agar mereka dapat menggunakan modul absensi." },
    { title: "Melakukan Absensi Selfie", description: "Buka halaman absensi, ikuti petunjuk aplikasi, dan kirim pencatatan kehadiran." },
    { title: "Memproses Pengajuan Cuti", description: "Tinjau detail permintaan cuti dan perbarui statusnya sesuai kebijakan perusahaan." },
  ],

  faq: [
    { question: "Apakah absensi karyawan menggunakan selfie?", answer: "Ya. KS25 Absensi mendukung pencatatan kehadiran dengan selfie melalui perangkat yang digunakan karyawan." },
    { question: "Bisakah pengelola memantau absensi melalui web?", answer: "Ya. Modul dapat diakses melalui Android dan web sesuai akun serta workspace perusahaan." },
    { question: "Apakah KS25 Absensi mendukung pengajuan cuti?", answer: "Ya. Fitur pengajuan cuti membantu karyawan menyampaikan permintaan dan pengelola meninjaunya." },
  ],

  status: "stable",

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

  status: "coming-soon",

},

  {
  moduleId: "packflow",

  name: "KS25 PackFlow",

  description:
    "Pemindaian resi dan monitoring proses packing.",

  longDescription:
    "KS25 PackFlow adalah aplikasi pengelolaan resi dan proses packing untuk membantu tim operasional memantau paket dari barang masuk hingga selesai diproses. Catat resi dengan scanner barcode atau input manual, pisahkan paket aktif dan pending, lalu cari kembali riwayat paket berdasarkan kode atau tanggal. PackFlow juga menyediakan permintaan barang operasional dalam workspace perusahaan.",

  version: "1.0.0",

  image: "/images/modules/packflow2.png",

  heroImage: "/images/modules/packflow2.png",

  screenshots: [
    "/ads/ks25-packflow-showcase.png",
    "/ads/ks25-packflow-active-parcels-android-frame.png",
  ],

  logo: "/images/modules/packflow2.png",

  category: "fulfillment",

  color: "from-cyan-500 to-sky-500",

  ready: true,

  route: "/packflow",

  features: [
    { icon: "📦", title: "Kelola Resi", description: "Catat, cari, dan pantau resi aktif serta daftar paket pending." },
    { icon: "🔎", title: "Pencarian Cepat", description: "Temukan resi berdasarkan barcode dengan scanner atau input keyboard." },
    { icon: "🧾", title: "Riwayat Pemrosesan", description: "Simpan jejak resi yang selesai diproses berdasarkan tanggal." },
    { icon: "🛒", title: "Permintaan Barang", description: "Ajukan kebutuhan operasional dan pantau status pemenuhannya." },
  ],

  workflows: [
    { title: "Catat Resi", description: "Pindai dengan scanner barcode atau ketik kode untuk menambah resi." },
    { title: "Proses Paket", description: "Tinjau daftar pending lalu tandai paket yang telah selesai." },
    { title: "Pantau Riwayat", description: "Cari kembali resi selesai berdasarkan barcode atau tanggal." },
    { title: "Kelola Operasional", description: "Kirim permintaan barang dan pantau proses pemenuhannya." },
  ],

  tutorials: [
    { title: "Memulai PackFlow", description: "Buka menu Resi Aktif untuk mulai mencatat barang masuk." },
    { title: "Memproses Resi", description: "Gunakan menu Pending untuk mencatat penyelesaian packing." },
  ],

  faq: [
    { question: "Apakah PackFlow bisa dipakai dengan scanner barcode?", answer: "Ya. Input resi menerima scanner barcode USB/Bluetooth yang bertindak sebagai keyboard, dan kode juga dapat diketik manual." },
    { question: "Apakah data dibagikan antar anggota perusahaan?", answer: "Data PackFlow tersimpan berdasarkan perusahaan yang sedang aktif di KS25 Digital Studio." },
  ],

  status: "stable",

},

];
