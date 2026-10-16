const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const sourceDir = path.join(root, "public", "images", "modules");
const outputDir = path.join(root, "public", "ads", "android-screens");
const W = 1080;
const H = 1920;

const liveScreens = [
  { source: "live-playlist.png", file: "live-assistant-playlist.png", title: "Playlist Live", subtitle: "Susun urutan produk sebelum mulai live.", accent: "#8b5cf6" },
  { source: "live-products.png", file: "live-assistant-products.png", title: "Produk dalam Playlist", subtitle: "Pilih produk yang ingin ditampilkan.", accent: "#8b5cf6" },
  { source: "live-teleprompter.png", file: "live-assistant-teleprompter.png", title: "AI Teleprompter", subtitle: "Baca skrip dengan kontrol presentasi yang praktis.", accent: "#8b5cf6" },
  { source: "live-ai.png", file: "live-assistant-ai-script.png", title: "Generate Skrip AI", subtitle: "Siapkan skrip produk dengan bantuan AI.", accent: "#8b5cf6" },
  { source: "live-history.png", file: "live-assistant-history.png", title: "Riwayat Live", subtitle: "Buka kembali playlist live sebelumnya.", accent: "#8b5cf6" },
];

const showcaseScreens = [
  {
    source: "pos2.png", file: "ks25-pos-showcase.png", module: "KS25 POS", title: "Kasir & Penjualan",
    subtitle: "Kelola transaksi penjualan dengan lebih praktis.", accent: "#2563eb",
    features: ["Transaksi kasir", "Produk dan stok", "Laporan penjualan"],
  },
  {
    source: "attendance2.png", file: "ks25-attendance-showcase.png", module: "KS25 ABSENSI", title: "Absensi Karyawan",
    subtitle: "Catat kehadiran melalui selfie dan lokasi kerja.", accent: "#ea580c",
    features: ["Selfie kehadiran", "Validasi lokasi kerja", "Riwayat dan laporan"],
  },
  {
    source: "packflow2.png", file: "ks25-packflow-showcase.png", module: "KS25 PACKFLOW", title: "Resi & Proses Packing",
    subtitle: "Pantau paket dari resi masuk hingga selesai diproses.", accent: "#0891b2",
    features: ["Kelola resi aktif", "Daftar paket pending", "Riwayat pemrosesan"],
  },
];

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const imageData = async (file) => {
  const buffer = await fs.readFile(path.join(sourceDir, file));
  const metadata = await sharp(buffer).metadata();
  const mime = metadata.format === "jpeg" ? "image/jpeg" : "image/png";
  return `data:${mime};base64,${buffer.toString("base64")}`;
};

function outerFrame({ title, subtitle, content, accent = "#7c3aed" }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="back" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f7f3ff"/><stop offset=".5" stop-color="#f5f7ff"/><stop offset="1" stop-color="#e9e7ff"/></linearGradient>
    <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#303344"/><stop offset=".45" stop-color="#080a11"/><stop offset="1" stop-color="#222638"/></linearGradient>
    <filter id="shadow" x="-40%" y="-30%" width="180%" height="180%"><feDropShadow dx="0" dy="28" stdDeviation="26" flood-color="#24204b" flood-opacity=".24"/></filter>
    <clipPath id="screen"><rect x="222" y="330" width="636" height="1310" rx="58"/></clipPath>
    <radialGradient id="glow"><stop stop-color="${accent}" stop-opacity=".19"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#back)"/>
  <circle cx="180" cy="490" r="430" fill="url(#glow)"/>
  <circle cx="1030" cy="1450" r="410" fill="url(#glow)"/>
  <text x="540" y="90" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="4" fill="#51417e">KS25 DIGITAL STUDIO</text>
  <text x="540" y="156" text-anchor="middle" font-family="Arial, sans-serif" font-size="43" font-weight="700" fill="#15122a">${esc(title)}</text>
  <text x="540" y="202" text-anchor="middle" font-family="Arial, sans-serif" font-size="23" fill="#635f77">${esc(subtitle)}</text>
  <g filter="url(#shadow)">
    <rect x="180" y="250" width="720" height="1470" rx="100" fill="url(#metal)" stroke="#4e5264" stroke-width="3"/>
    <rect x="207" y="277" width="666" height="1416" rx="73" fill="#06070b"/>
    <rect x="222" y="330" width="636" height="1310" rx="58" fill="#fff"/>
    <g clip-path="url(#screen)">${content}</g>
    <rect x="476" y="292" width="128" height="19" rx="10" fill="#020307"/>
    <circle cx="621" cy="301" r="5" fill="#20243a"/>
    <rect x="168" y="575" width="12" height="110" rx="6" fill="#393d4d"/>
    <rect x="900" y="488" width="12" height="156" rx="6" fill="#393d4d"/>
  </g>
  <text x="540" y="1788" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="600" fill="#51417e">Solusi bisnis dalam satu platform</text>
  <text x="540" y="1830" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#747084">ks25studio.web.id</text>
</svg>`;
}

function systemBar() {
  return `<rect x="222" y="330" width="636" height="50" fill="#111018"/>
    <text x="252" y="363" font-family="Arial, sans-serif" font-size="19" font-weight="600" fill="#fff">9:41</text>
    <g fill="#fff"><rect x="778" y="351" width="4" height="10" rx="2"/><rect x="785" y="347" width="4" height="14" rx="2"/><rect x="792" y="343" width="4" height="18" rx="2"/></g>
    <rect x="810" y="345" width="26" height="16" rx="4" fill="none" stroke="#fff" stroke-width="2"/><rect x="837" y="350" width="3" height="6" rx="1" fill="#fff"/><rect x="813" y="348" width="18" height="10" rx="2" fill="#fff"/>`;
}

async function addLiveScreen(screen) {
  const src = await imageData(screen.source);
  const content = `${systemBar()}<image x="222" y="380" width="636" height="1260" preserveAspectRatio="xMidYMid meet" href="${src}"/><rect x="222" y="1612" width="636" height="28" fill="#101014"/><rect x="470" y="1622" width="140" height="6" rx="3" fill="#fff"/>`;
  const svg = outerFrame({ title: screen.title, subtitle: screen.subtitle, content, accent: screen.accent });
  await sharp(Buffer.from(svg)).png().toFile(path.join(outputDir, screen.file));
}

async function addShowcaseScreen(screen) {
  const art = await imageData(screen.source);
  const featureRows = screen.features.map((label, index) => {
    const y = 1165 + index * 112;
    return `<rect x="250" y="${y}" width="580" height="88" rx="22" fill="#fff" stroke="#e6e7ef" stroke-width="2"/>
      <circle cx="290" cy="${y + 44}" r="17" fill="${screen.accent}" fill-opacity=".13"/><path d="M282 ${y + 44}l6 6 12-14" fill="none" stroke="${screen.accent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="324" y="${y + 52}" font-family="Arial, sans-serif" font-size="25" font-weight="600" fill="#252333">${esc(label)}</text>`;
  }).join("");
  const content = `${systemBar()}
    <rect x="222" y="380" width="636" height="1260" fill="#f7f8fc"/>
    <rect x="222" y="380" width="636" height="106" fill="#fff"/>
    <text x="258" y="427" font-family="Arial, sans-serif" font-size="17" font-weight="700" letter-spacing="2" fill="${screen.accent}">${esc(screen.module)}</text>
    <text x="258" y="464" font-family="Arial, sans-serif" font-size="23" font-weight="700" fill="#242233">KS25 Digital Studio</text>
    <rect x="246" y="512" width="588" height="104" rx="24" fill="${screen.accent}"/>
    <text x="278" y="555" font-family="Arial, sans-serif" font-size="31" font-weight="700" fill="#fff">${esc(screen.title)}</text>
    <text x="278" y="589" font-family="Arial, sans-serif" font-size="19" fill="#fff" fill-opacity=".9">${esc(screen.subtitle)}</text>
    <rect x="246" y="638" width="588" height="480" rx="30" fill="#fff" stroke="#e6e7ef" stroke-width="2"/>
    <image x="250" y="642" width="580" height="472" preserveAspectRatio="xMidYMid meet" href="${art}"/>
    <text x="252" y="1150" font-family="Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="1.5" fill="#777589">FITUR UTAMA</text>
    ${featureRows}
    <rect x="222" y="1612" width="636" height="28" fill="#101014"/><rect x="470" y="1622" width="140" height="6" rx="3" fill="#fff"/>`;
  const svg = outerFrame({ title: screen.module, subtitle: screen.subtitle, content, accent: screen.accent });
  await sharp(Buffer.from(svg)).png().toFile(path.join(outputDir, screen.file));
}

async function addDashboard() {
  const modules = [
    { name: "KS25 Live Assistant", sub: "AI untuk live shopping", image: "live2.png", color: "#7644e8" },
    { name: "KS25 POS", sub: "Kasir untuk UMKM", image: "pos2.png", color: "#2563eb" },
    { name: "KS25 Absensi", sub: "Kehadiran karyawan", image: "attendance2.png", color: "#ea580c" },
    { name: "KS25 PackFlow", sub: "Resi dan proses packing", image: "packflow2.png", color: "#0891b2" },
  ];
  let cards = "";
  for (let i = 0; i < modules.length; i++) {
    const item = modules[i];
    const art = await imageData(item.image);
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 244 + col * 304;
    const y = 748 + row * 397;
    cards += `<rect x="${x}" y="${y}" width="288" height="372" rx="24" fill="#fff" stroke="#e5e3ed" stroke-width="2"/>
      <rect x="${x}" y="${y}" width="288" height="190" rx="24" fill="${item.color}"/>
      <image x="${x}" y="${y}" width="288" height="190" preserveAspectRatio="xMidYMid slice" href="${art}"/>
      <text x="${x + 20}" y="${y + 230}" font-family="Arial, sans-serif" font-size="21" font-weight="700" fill="#242233">${esc(item.name)}</text>
      <text x="${x + 20}" y="${y + 264}" font-family="Arial, sans-serif" font-size="16" fill="#69677a">${esc(item.sub)}</text>
      <rect x="${x + 18}" y="${y + 294}" width="112" height="34" rx="17" fill="#eefaf2"/><text x="${x + 74}" y="${y + 317}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="600" fill="#178247">STABLE</text>
      <text x="${x + 20}" y="${y + 354}" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="${item.color}">Buka aplikasi  ›</text>`;
  }
  const content = `${systemBar()}
    <rect x="222" y="380" width="636" height="1260" fill="#f7f6fb"/>
    <rect x="222" y="380" width="636" height="316" rx="0" fill="#fff"/>
    <rect x="222" y="380" width="636" height="316" fill="#7442df"/>
    <circle cx="820" cy="418" r="170" fill="#fff" fill-opacity=".09"/>
    <text x="260" y="442" font-family="Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="2" fill="#efe9ff">KS25 DIGITAL STUDIO</text>
    <text x="260" y="520" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#fff">Halo, 👋</text>
    <text x="260" y="574" font-family="Arial, sans-serif" font-size="23" fill="#fff">Kelola aplikasi bisnis Anda</text>
    <text x="260" y="610" font-family="Arial, sans-serif" font-size="23" fill="#fff">dalam satu platform.</text>
    <rect x="260" y="638" width="236" height="42" rx="21" fill="#fff" fill-opacity=".18"/><text x="378" y="666" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="600" fill="#fff">4 MODUL TERSEDIA</text>
    <text x="244" y="728" font-family="Arial, sans-serif" font-size="23" font-weight="700" fill="#252333">Aplikasi Bisnis</text>
    ${cards}
    <rect x="222" y="1518" width="636" height="94" fill="#fff" stroke="#e8e7ef" stroke-width="1"/>
    <text x="276" y="1568" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#7550d8">⌂</text><text x="276" y="1593" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#7550d8">Dashboard</text>
    <text x="403" y="1568" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#777589">▦</text><text x="403" y="1593" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#777589">My Apps</text>
    <text x="531" y="1568" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#777589">♙</text><text x="531" y="1593" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#777589">Langganan</text>
    <text x="659" y="1568" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#777589">◉</text><text x="659" y="1593" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#777589">Info</text>
    <text x="786" y="1568" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#777589">?</text><text x="786" y="1593" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#777589">Bantuan</text>
    <rect x="222" y="1612" width="636" height="28" fill="#101014"/><rect x="470" y="1622" width="140" height="6" rx="3" fill="#fff"/>`;
  const svg = outerFrame({ title: "Dashboard Utama", subtitle: "Empat modul siap dalam satu aplikasi.", content, accent: "#7442df" });
  await sharp(Buffer.from(svg)).png().toFile(path.join(outputDir, "dashboard-utama.png"));
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });
  await addDashboard();
  for (const screen of liveScreens) await addLiveScreen(screen);
  for (const screen of showcaseScreens) await addShowcaseScreen(screen);
  const readme = [
    "# Set mockup layar KS25 dalam frame Android",
    "",
    "Semua file berukuran 1080 x 1920 PNG untuk materi vertikal.",
    "",
    "- dashboard-utama.png adalah komposisi dashboard dua kolom berdasarkan struktur dashboard saat ini, termasuk navigasi Bantuan; cover tiap modul memakai artwork produk dari public/images/modules.",
    "- live-assistant-*.png memakai screenshot aplikasi Live Assistant yang sudah tersedia di repositori, dibingkai dengan perangkat Android.",
    "- ks25-*-showcase.png adalah komposisi promosi memakai artwork modul yang ada, bukan tangkapan langsung dari aplikasi.",
    "- Undangan Digital tidak disertakan karena belum siap dipromosikan.",
    "",
    "Dashboard produksi saat ini memerlukan login, sehingga layar dashboard dan fitur POS, Absensi, serta PackFlow tidak dapat diambil langsung dari sesi aplikasi. Ganti komposisi showcase dengan screenshot runtime sebelum menggunakannya sebagai bukti UI yang persis.",
    "",
  ].join("\n");
  await fs.writeFile(path.join(outputDir, "README.md"), readme, "utf8");
  console.log(`Created ${1 + liveScreens.length + showcaseScreens.length} assets in ${outputDir}`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
