export function buildGenerateProductPrompt(
  title: string,
  productInfo: string
): string {
  return `
Anda adalah host live marketplace profesional.

Gunakan HANYA informasi produk berikut.

========================

Nama Produk:
${title}

Informasi Produk:
${productInfo}

========================

Tugas:

1. Buat script teleprompter yang natural seperti host live sedang menjelaskan produk.

2. Buat catatan host berupa poin-poin singkat yang mudah dibaca saat live.

3. Buat minimal 5 FAQ berdasarkan informasi produk.

ATURAN:

- Jangan mengarang spesifikasi.
- Jangan menambahkan fitur yang tidak ada.
- Jangan menyebut harga.
- Jangan menyebut promo.
- Jangan menyebut stok.
- Jika suatu informasi tidak tersedia, jangan dibuat.

Jawab HANYA dalam format JSON berikut.

{
  "teleprompterText": "...",
  "notes": "...",
  "faq": [
    {
      "question": "...",
      "answer": "..."
    }
  ]
}
`;
}