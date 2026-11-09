# Tugas 3 Komputasi Awan: Deployment Website dengan GitHub Pages

Website portofolio statis (HTML, CSS, JavaScript) untuk mata kuliah Komputasi Awan, Universitas Muhammadiyah Palangkaraya.

- Nama: Hafiz Akbar Habibie Wijaya
- NIM: 23.53.028035

## Halaman

| Berkas | Isi |
| --- | --- |
| `index.html` | Beranda: profil, skills, proyek, perjalanan skripsi, karakteristik, kontak |
| `materi.html` | Materi Komputasi Awan: pengertian, SaaS/PaaS/IaaS, manfaat dan risiko |
| `portofolio.html` | Portofolio Tugas: tautan Tugas 1 dan Tugas 2, alur deployment |
| `devlog.html` | Devlog NATA per sprint (Sprint 1 sampai 6) |
| `404.html` | Halaman untuk alamat yang tidak ditemukan |

## Struktur

```
index.html, materi.html, portofolio.html, devlog.html, 404.html
assets/css/      gaya (style.css)
assets/js/       interaksi (script.js)
assets/fonts/    Plus Jakarta Sans dan JetBrains Mono (dipasang lokal)
assets/images/   foto, favicon, gambar pratinjau link
.github/workflows/check.yml   cek otomatis HTML dan Lighthouse
```

## Menjalankan secara lokal

Buka `index.html` langsung di browser.

## Deploy ke GitHub Pages (lewat web)

1. Buat repositori publik bernama `tugas3-cloud-23.53.028035`.
2. Unggah seluruh isi folder lewat **Add file > Upload files** (seret semua berkas dan folder).
3. Jika folder `.github` tidak ikut terunggah, buat manual lewat **Add file > Create new file**, ketik `.github/workflows/check.yml` sebagai nama, lalu tempel isi berkasnya.
4. Buka **Settings > Pages**, pilih sumber dari branch utama dan folder `/ (root)`, lalu simpan.
5. Tunggu hingga GitHub Pages menampilkan alamat website.

## Bukti versi 2

Footer menampilkan lencana **Versi 1.0**. Untuk versi 2, ubah teks `Versi 1.0` menjadi `Versi 2.0` di footer pada keempat berkas HTML (riwayat versi di Portofolio ikut berubah otomatis), lalu commit dengan keterangan `Pembaruan versi 2`.

## Sebelum mengumpulkan

- Foto profil sudah terpasang (`assets/images/foto-profil.jpg`). Pastikan foto itu memang foto kamu yang pantas dipublikasikan.
- Pada tag `og:url` dan `og:image` di setiap berkas HTML, alamat `https://apiss77.github.io/tugas3-cloud-23.53.028035/` adalah perkiraan. Sesuaikan jika nama repositori atau akun berbeda.
- Buka tautan Tugas 1 dan Tugas 2 di jendela privat untuk memastikan dosen bisa mengaksesnya.
