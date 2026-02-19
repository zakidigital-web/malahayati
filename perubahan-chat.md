# Riwayat Perubahan (Sesi Chat)

Tanggal: 2026-02-18

## Ringkasan Permintaan dan Aksi
- Perbaiki gambar Google Drive pada bagian Tim tidak tampil walau publik → Standarisasi proxy `/api/drive-image` dan helper `toDisplayUrl` di komponen terkait.
- Lanjutkan verifikasi komponen publik → Audit homepage; hero slider sudah memakai proxy yang benar.
- Sesuaikan informasi beranda/homepage agar sesuai keadaan → Pembaruan statistik, judul/teks deskripsi, narasi “Mengapa Memilih Kami”, serta detail kontak.
- Upload seluruh kode ke GitHub (perubahan maupun tidak) → Sinkronisasi branch `main`.
- Ganti nomor “WA Admin” → Diperbarui ke `+1 417 6308853`.

## Perubahan per Berkas
- `src/components/pages/AboutPage.tsx`
  - Tambah helper `toDisplayUrl` untuk mengubah tautan Google Drive menjadi endpoint `/api/drive-image`.
  - Gunakan `toDisplayUrl` pada avatar anggota tim di dua seksi (struktur organisasi dan tim).
  - Hilangkan duplikasi fungsi inline untuk konsistensi dan perawatan lebih mudah.

- `src/app/about/page.tsx`
  - Terapkan `toDisplayUrl` pada bagian tim agar foto dari Google Drive selalu tampil (via proxy).

- `src/app/admin/team/page.tsx`
  - Perbaiki pratinjau gambar anggota tim di halaman admin agar melalui `toDisplayUrl`/proxy.
  - Tautan “Lihat Foto” memakai URL proxy yang benar.

- `src/app/api/drive-image/route.ts`
  - Perbaiki penanganan response tipe biner dari Google Drive API (konversi ke `Uint8Array` lalu `Blob` agar cocok dengan `NextResponse`).
  - Pertahankan fallback redirect ke `https://drive.google.com/uc?export=view&id=...` bila kredensial tidak tersedia/izin terbatas.
  - Tambah header cache yang sesuai (`public, max-age=86400, immutable`).

- `src/components/pages/ArticleModal.tsx`
  - Perbaiki penanganan `src` pada elemen `img` di markdown (kompatibel dengan string/Blob) dan lewati melalui `toDisplayUrl` untuk dukungan Google Drive.

- `src/components/pages/HomePage.tsx`
  - Pembaruan konten:
    - Statistik: `3+ Tahun Mendampingi`, `200+ Klien Terlayani`, `95% Kepuasan Klien`, `8+ Tim Hukum & Paralegal`.
    - Judul/Deskripsi: “YKBH Malahayati Banyuwangi — Akses Keadilan untuk Semua”; narasi disesuaikan dengan konteks sejak 2022.
    - Badge angka pada ilustrasi: `3+ Tahun Mendampingi`.
    - Narasi “Mengapa Memilih Kami” menegaskan konteks lokal (Banyuwangi) dan capaian ratusan klien.
    - Kontak: perjelas alamat; label “WA Admin”; ganti nomor resmi menjadi `+1 417 6308853`.

## Validasi
- Lint: sukses.
- Typecheck: telah diperbaiki error tipe di API proxy dan komponen markdown; pengecekan terbaru berhasil.

## Commit & Push
- `team-drive-images-fix` → Perbaikan tampilan gambar tim via proxy dan penyesuaian terkait.
- `home-copy-refresh` → Penyesuaian konten beranda (statistik, deskripsi, alasan pilih kami) dan perbaikan tipe proxy/markdown img.
- `wa-admin-number-update` → Pembaruan nomor “WA Admin” ke `+1 417 6308853`.

## Catatan
- Endpoint `/api/drive-image` otomatis memakai kredensial service account bila tersedia; jika tidak, diarahkan ke URL publik Google Drive agar tetap tampil.
- Untuk chat WhatsApp yang bisa diklik, gunakan tautan: `https://wa.me/14176308853` (opsional diintegrasikan ke UI).

