export const metadata = {
  title: "Hapus Akun | KS25 - Mitra UMKM",
  description:
    "Panduan penghapusan akun dan data pengguna KS25 - Mitra UMKM.",
};

export default function DeleteAccountPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">

      <h1 className="mb-2 text-4xl font-bold">
        Penghapusan Akun
      </h1>

      <p className="mb-10 text-muted-foreground">
        Terakhir diperbarui: 6 Juli 2026
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">

        <section>
          <p>
            Pengguna memiliki hak untuk menghapus akun beserta data yang
            dimiliki di aplikasi <strong>KS25 - Mitra UMKM</strong>.
          </p>

          <p>
            Saat ini penghapusan akun dapat dilakukan dengan menghubungi
            tim kami melalui email.
          </p>
        </section>

        <section>
          <h2>Cara Menghapus Akun</h2>

          <ol>
            <li>
              Kirim email ke alamat <strong>support@ks25studio.web.id</strong>.
            </li>

            <li>
              Gunakan subjek email:
              <br />
              <strong>Permintaan Penghapusan Akun</strong>
            </li>

            <li>
              Sertakan alamat email yang digunakan untuk login pada aplikasi.
            </li>

            <li>
              Tim kami akan melakukan verifikasi kepemilikan akun.
            </li>

            <li>
              Setelah verifikasi berhasil, akun dan data akan diproses untuk
              dihapus.
            </li>
          </ol>
        </section>

        <section>
          <h2>Data yang Akan Dihapus</h2>

          <ul>
            <li>Akun pengguna.</li>
            <li>Data perusahaan.</li>
            <li>Produk.</li>
            <li>Kategori.</li>
            <li>Playlist.</li>
            <li>Riwayat live.</li>
            <li>Pengaturan aplikasi.</li>
            <li>Data lain yang terkait dengan akun tersebut.</li>
          </ul>
        </section>

        <section>
          <h2>Data yang Mungkin Tetap Disimpan</h2>

          <p>
            Kami dapat menyimpan data tertentu apabila diwajibkan oleh
            peraturan perundang-undangan yang berlaku, untuk penyelesaian
            sengketa, pencegahan penyalahgunaan layanan, atau memenuhi
            kewajiban hukum lainnya.
          </p>
        </section>

        <section>
          <h2>Waktu Pemrosesan</h2>

          <p>
            Permintaan penghapusan akun akan diproses paling lambat
            <strong> 7 hari kerja</strong> setelah proses verifikasi selesai.
          </p>
        </section>

        <section>
          <h2>Hubungi Kami</h2>

          <p>
            Whatsapp:
            <br />
            <strong>6285710255464</strong>
          </p>

          <p>
            Email:
            <br />
            <strong>khairashop25@gmail.com</strong>
          </p>

          <p>
            Website:
            <br />
            <strong>https://www.ks25studio.web.id</strong>
          </p>

        </section>

      </div>

    </main>
  );
}