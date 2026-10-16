const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const inputDir = "C:/Users/LENOVO/Downloads/ss";
const outputDir = path.resolve(__dirname, "../public/ads/android-screens/user-screenshots");
const screens = [
  { input: "1000406341.jpg", output: "ks25-pos-products-android-frame.png", title: "KS25 POS · Katalog Produk", subtitle: "Pilih produk dan varian untuk transaksi." },
  { input: "1000406343.jpg", output: "ks25-pos-monthly-report-android-frame.png", title: "KS25 POS · Laporan Bulanan", subtitle: "Pantau ringkasan keuangan usaha.", redact: "amounts" },
  { input: "1000406348.jpg", output: "ks25-attendance-selfie-android-frame.png", title: "KS25 Absensi · Selfie", subtitle: "Catat kehadiran dengan foto selfie." },
  { input: "1000406350.jpg", output: "ks25-attendance-settings-android-frame.png", title: "KS25 Absensi · Pengaturan", subtitle: "Atur profil dan lokasi kerja.", redact: "employee" },
  { input: "1000406352.jpg", output: "ks25-attendance-leave-android-frame.png", title: "KS25 Absensi · Pengajuan Cuti", subtitle: "Ajukan dan pantau status cuti.", redact: "leave" },
  { input: "1000406354.jpg", output: "ks25-attendance-admin-report-android-frame.png", title: "KS25 Absensi · Rekap Admin", subtitle: "Lihat rekap kehadiran karyawan.", redact: "employees" },
  { input: "1000406359.jpg", output: "ks25-packflow-active-parcels-android-frame.png", title: "KS25 PackFlow · Resi Aktif", subtitle: "Kelola paket dan pantau proses packing.", redact: "tracking" },
  { input: "1000406363.jpg", output: "ks25-packflow-barcode-scan-android-frame.png", title: "KS25 PackFlow · Pemindai Resi", subtitle: "Pindai barcode paket dengan cepat.", redact: "parcel-label" },
];

function redactions(kind, width, height) {
  const rect = (x, y, w, h) => ({ left: Math.round(x * width), top: Math.round(y * height), width: Math.round(w * width), height: Math.round(h * height) });
  if (kind === "amounts") return [0.15, 0.275, 0.395, 0.525, 0.65, 0.77].map((y) => rect(0.075, y, 0.58, 0.07));
  if (kind === "employee") return [rect(0.075, 0.07, 0.72, 0.065), rect(0.075, 0.37, 0.72, 0.085)];
  if (kind === "leave") return [rect(0.075, 0.775, 0.78, 0.085)];
  if (kind === "employees") return [0.423, 0.504, 0.585, 0.666].map((y) => rect(0.075, y, 0.65, 0.073));
  if (kind === "tracking") return [
    rect(0.075, 0.078, 0.82, 0.04),
    rect(0.075, 0.385, 0.83, 0.052),
    rect(0.075, 0.69, 0.60, 0.05),
    rect(0.075, 0.77, 0.60, 0.05),
    rect(0.075, 0.85, 0.60, 0.05),
  ];
  if (kind === "parcel-label") return [rect(0.13, 0.33, 0.76, 0.54)];
  return [];
}

async function safeScreenshot(screen) {
  const source = path.join(inputDir, screen.input);
  const oriented = sharp(source).rotate();
  const metadata = await oriented.metadata();
  let buffer = await oriented.png().toBuffer();
  const regions = redactions(screen.redact, metadata.width, metadata.height);
  for (const region of regions) {
    const blurred = await sharp(buffer).extract(region).blur(20).png().toBuffer();
    buffer = await sharp(buffer).composite([{ input: blurred, left: region.left, top: region.top }]).png().toBuffer();
  }
  return buffer;
}

function frameSvg(screen, screenshotData) {
  const { title, subtitle } = screen;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8f5ff"/><stop offset=".55" stop-color="#f3f5fb"/><stop offset="1" stop-color="#ebe9f8"/></linearGradient>
    <linearGradient id="phone" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#303344"/><stop offset=".45" stop-color="#070910"/><stop offset="1" stop-color="#25293a"/></linearGradient>
    <filter id="shadow" x="-30%" y="-25%" width="160%" height="160%"><feDropShadow dx="0" dy="24" stdDeviation="22" flood-color="#20203b" flood-opacity=".25"/></filter>
    <clipPath id="screen"><rect x="157" y="157" width="766" height="1686" rx="66"/></clipPath>
  </defs>
  <rect width="1080" height="1920" fill="url(#background)"/>
  <circle cx="65" cy="640" r="345" fill="#835be8" fill-opacity=".08"/>
  <circle cx="1020" cy="1430" r="390" fill="#4e83da" fill-opacity=".07"/>
  <text x="540" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="3" fill="#55457f">KS25 DIGITAL STUDIO</text>
  <text x="540" y="105" text-anchor="middle" font-family="Arial, sans-serif" font-size="21" fill="#696579">${subtitle}</text>
  <g filter="url(#shadow)">
    <rect x="130" y="130" width="820" height="1740" rx="100" fill="url(#phone)" stroke="#464a5b" stroke-width="3"/>
    <rect x="157" y="157" width="766" height="1686" rx="66" fill="#fff"/>
    <g clip-path="url(#screen)">
      <rect x="157" y="157" width="766" height="50" fill="#111018"/>
      <text x="188" y="190" font-family="Arial, sans-serif" font-size="18" font-weight="600" fill="#fff">9:41</text>
      <g fill="#fff"><rect x="846" y="178" width="4" height="10" rx="2"/><rect x="853" y="174" width="4" height="14" rx="2"/><rect x="860" y="170" width="4" height="18" rx="2"/></g>
      <rect x="878" y="172" width="25" height="16" rx="4" fill="none" stroke="#fff" stroke-width="2"/><rect x="904" y="177" width="3" height="6" rx="1" fill="#fff"/><rect x="881" y="175" width="17" height="10" rx="2" fill="#fff"/>
      <image x="157" y="207" width="766" height="1608" preserveAspectRatio="xMidYMid meet" href="${screenshotData}"/>
      <rect x="157" y="1815" width="766" height="28" fill="#101014"/><rect x="472" y="1825" width="136" height="6" rx="3" fill="#fff"/>
    </g>
    <rect x="486" y="140" width="108" height="10" rx="5" fill="#080a0f"/><circle cx="612" cy="145" r="4" fill="#222638"/>
    <rect x="118" y="460" width="12" height="110" rx="6" fill="#3c4050"/><rect x="950" y="450" width="12" height="150" rx="6" fill="#3c4050"/>
  </g>
  <text x="540" y="1906" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="600" fill="#655b7f">${title}</text>
</svg>`;
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });
  for (const screen of screens) {
    const buffer = await safeScreenshot(screen);
    const svg = frameSvg(screen, `data:image/png;base64,${buffer.toString("base64")}`);
    await sharp(Buffer.from(svg)).png().toFile(path.join(outputDir, screen.output));
  }
  const notes = [
    "# Screenshot KS25 dengan frame Android",
    "",
    "Delapan screenshot asli yang diberikan pengguna sudah dipasang ke frame Android. Output PNG berukuran 1080 x 1920 untuk materi vertikal.",
    "",
    "Data nominal laporan, nama/NIK karyawan, alasan cuti, nomor resi, dan label pengiriman disamarkan pada aset terkait sebelum dipakai untuk iklan.",
    "",
    "File sumber pengguna tetap berada di folder Downloads dan tidak diubah.",
    "",
  ].join("\n");
  await fs.writeFile(path.join(outputDir, "README.md"), notes, "utf8");
  console.log(`Framed ${screens.length} screenshots at ${outputDir}`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });

