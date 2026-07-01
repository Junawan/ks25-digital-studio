export function cleanProductInfo(
  description: string
): string {
  const skipLines = [
    "READY STOCK",
    "FAST RESPON",
    "FAST RESPONSE",
    "FOLLOW TOKO",
    "FOLLOW SHOP",
    "LIKE & FOLLOW",
    "LIKE DAN FOLLOW",
    "CHAT ADMIN",
    "ORDER SEKARANG",
    "BELI SEKARANG",
    "TERIMA KASIH TELAH BERKUNJUNG",
  ];

  const stopSections = [
    "PACKAGING",
    "PACKING",
    "PACKING AMAN",
    "CATATAN PENJUAL",
    "DISCLAIMER",
    "KETENTUAN TOKO",
    "SYARAT & KETENTUAN",
    "INFORMASI TOKO",
  ];

  const lines = description
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const result: string[] = [];

  let skipSection = false;

  for (const line of lines) {
    const upper = line.toUpperCase();

    // ===== mulai section yang dibuang =====
    if (
      stopSections.some((keyword) =>
        upper.includes(keyword)
      )
    ) {
      skipSection = true;
      continue;
    }

    // ===== jika menemukan heading baru, lanjut baca lagi =====
    if (
      skipSection &&
      /^[A-ZÀ-ÿ0-9\s&/-]{3,}$/.test(line)
    ) {
      skipSection = false;
    }

    if (skipSection) {
      continue;
    }

    // ===== skip baris promosi =====
    if (
      skipLines.some((keyword) =>
        upper.includes(keyword)
      )
    ) {
      continue;
    }

    // ===== separator ######## =====
    if (/^[#=*_\-]{5,}$/.test(line)) {
      continue;
    }

    // ===== separator bullet =====
    if (/^[•●▪■⭐★☆\s]+$/.test(line)) {
      continue;
    }

    // ===== separator ------------ =====
    if (/^[-=]{5,}$/.test(line)) {
      continue;
    }

    result.push(line);
  }

  return result.join("\n");
}