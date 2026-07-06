export const metadata = {
  title: "Kebijakan Privasi | KS25 - Mitra UMKM",
  description:
    "Kebijakan Privasi aplikasi KS25 - Mitra UMKM.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="mb-2 text-4xl font-bold">
        Kebijakan Privasi
      </h1>

      <p className="mb-10 text-muted-foreground">
        Terakhir diperbarui: 6 Juli 2026
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">

        <section>
          <p>
            Selamat datang di <strong>KS25 - Mitra UMKM</strong>.
          </p>

          <p>
            Kami berkomitmen untuk melindungi privasi setiap pengguna.
            Kebijakan Privasi ini menjelaskan bagaimana informasi
            dikumpulkan, digunakan, disimpan, dan dilindungi saat Anda
            menggunakan aplikasi kami.
          </p>
        </section>

        <section>
          <h2>Informasi yang Kami Kumpulkan</h2>

          <p>
            Kami dapat mengumpulkan informasi berikut:
          </p>

          <ul>
            <li>Nama pengguna</li>
            <li>Alamat email</li>
            <li>Data perusahaan atau usaha</li>
            <li>Data produk</li>
            <li>Playlist</li>
            <li>Riwayat penggunaan fitur</li>
            <li>Pengaturan aplikasi</li>
          </ul>
        </section>

        <section>
          <h2>Bagaimana Data Digunakan</h2>

          <p>
            Informasi digunakan untuk:
          </p>

          <ul>
            <li>Menyediakan layanan aplikasi.</li>
            <li>Mengelola akun pengguna.</li>
            <li>Menyimpan data usaha.</li>
            <li>Menyinkronkan data antar perangkat.</li>
            <li>Menghasilkan konten AI sesuai permintaan pengguna.</li>
            <li>Meningkatkan kualitas layanan.</li>
            <li>Menyampaikan informasi pembaruan aplikasi.</li>
          </ul>
        </section>

        <section>
          <h2>Penyimpanan Data</h2>

          <p>
            Data pengguna disimpan menggunakan layanan Google Firebase,
            termasuk Firebase Authentication, Cloud Firestore,
            dan Firebase Storage.
          </p>
        </section>

        <section>
          <h2>Layanan Pihak Ketiga</h2>

          <p>
            Aplikasi dapat menggunakan layanan berikut:
          </p>

          <ul>
            <li>Google Firebase</li>
            <li>Google Play Services</li>
            <li>OpenAI (fitur AI)</li>
          </ul>

          <p>
            Pada pembaruan berikutnya, aplikasi dapat menampilkan
            iklan melalui Google AdMob untuk pengguna paket gratis.
          </p>
        </section>

        <section>
          <h2>Keamanan</h2>

          <p>
            Kami menerapkan langkah-langkah yang wajar untuk melindungi
            data pengguna. Namun, tidak ada metode transmisi data melalui
            internet yang dapat dijamin 100% aman.
          </p>
        </section>

        <section>
          <h2>Hak Pengguna</h2>

          <p>
            Pengguna memiliki hak untuk:
          </p>

          <ul>
            <li>Mengakses data miliknya.</li>
            <li>Memperbarui data.</li>
            <li>Menghapus data.</li>
            <li>Berhenti menggunakan layanan kapan saja.</li>
          </ul>
        </section>

        <section>
          <h2>Perubahan Kebijakan</h2>

          <p>
            Kebijakan Privasi ini dapat diperbarui sewaktu-waktu.
            Perubahan akan dipublikasikan pada halaman ini.
          </p>
        </section>

        <section>
          <h2>Hubungi Kami</h2>

          <p>
            Jika memiliki pertanyaan mengenai Kebijakan Privasi ini,
            silakan menghubungi kami melalui:
          </p>

          <p>
            <strong>KS25 Digital Studio</strong>
            <br />
            Website:
            <br />
            https://www.ks25studio.web.id
            <br />
            Email:
            <br />
            khairashop25@gmail.com
          </p>
        </section>

      </div>
    </main>
  );
}