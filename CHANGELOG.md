# Changelog
Seluruh perubahan penting pada proyek **Kamus Madura Digital** didokumentasikan dalam berkas ini.

## [1.0.0] - 2026-11-08

### Ditambahkan (Added)
- **Fondasi Sistem & Desain**:
  - Konfigurasi Vite 5 + React 18 + TypeScript ketat dengan alias path `@/*`.
  - Sistem token warna budaya Madura (Navy `#172B3A`, Forest `#1F5145`, Gold `#C5A66A`, Ivory `#F8F7F2`).
  - Pustaka komponen antarmuka mandiri: Button, Badge, Card, Input, Textarea, Select, Tabs, Modal, Toast, Breadcrumbs, ErrorBoundary, LoadingSpinner.
  - Klien HTTP Axios dengan injeksi JWT Supabase otomatis dan penanganan galat terpusat.
- **Mesin Pencarian Kamus**:
  - Algoritma pencarian dua arah (*Madura &rarr; Indonesia* & *Indonesia &rarr; Madura*).
  - Normalisasi ortografi aksen ganda (`â`, `è`, `'`) yang memungkinkan pengguna mencari lema tanpa mengharuskan input simbol khusus.
  - Pendeteksian afiks morfologis heuristik (*a-*, *ta-*, *ma-*, *ka-*, *-na*).
  - Skoring relevansi cerdas berbasis kesesuaian lema, prefiks, infiks, dan definisi.
- **Migrasi Data 100%**:
  - Mengonversi 9.789 baris prototipe lama `willnode/madura` menjadi 9.668 lema unik terstandarisasi dan 9.776 pasangan terjemahan.
  - Mempertahankan 100% vokal beraksen baku (2.429 karakter `â`, 2.784 karakter `è`, dan 1.036 tanda petik glottal `'`).
  - Berkas SQL migration seed utuh (`supabase/seed/seed.sql`) dan offline-first JSON bundle (`seed-dictionary.json`).
- **Fitur Pengguna Komunitas**:
  - Bookmark kata favorit dengan persistensi lokal dan indikator sinkronisasi cloud.
  - Riwayat pencarian otomatis dengan batas kapasitas 20 entri (*FIFO*).
  - Formulir partisipasi usulan kata baru dari masyarakat (/kontribusi).
  - Halaman otentikasi: Masuk (/login), Daftar Akun (/register), Profil Saya (/profil).
- **Dashboard Pengelola & Moderasi**:
  - Halaman ikhtisar metrik realtime dan grafik distribusi tingkat tutur (/admin).
  - Manajemen kosakata lema: tambah, sunting, cari, filter, dan hapus lema (/admin/kamus).
  - Manajemen kategori dan katalog dialek 4 kabupaten Madura (/admin/kategori).
  - Antrean moderasi kata usulan komunitas (/admin/kontribusi).
  - Manajemen hak akses pengguna berbasis peran RBAC (/admin/pengguna).
  - Bulk import data dari CSV dan ekspor koleksi kamus ke format JSON & CSV (/admin/import).
  - Manajemen artikel materi pembelajaran kebahasaan (/admin/artikel).
- **Pengujian & CI/CD**:
  - 18 unit test otomatis terverifikasi lulus dengan Vitest v2.
  - Pipeline GitHub Actions untuk pengecekan tipe, testing, dan automated production build.
  - Konfigurasi rilis Vercel SPA (`vercel.json`).

### Diperbaiki (Fixed)
- Memperbaiki potensi *infinite re-render loop* pada `dictionaryService.search` dengan memurnikan fungsi dari pemanggilan mutasi state riwayat pencarian selama fase render React.
- Memperbaiki sinkronisasi parameter URL pada hook `useDictionarySearch` menggunakan pengecekan diferensial nilai.
